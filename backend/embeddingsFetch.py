import uvicorn
import os
import faiss
import numpy as np
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pymongo import MongoClient
from sentence_transformers import SentenceTransformer
from dotenv import load_dotenv
from typing import List, Optional
import certifi
from fastapi.middleware.cors import CORSMiddleware
import logging


'''
You fire it up by running 
uvicorn backend.embeddingsFetch:app --reload
'''

load_dotenv() 
app = FastAPI()
# Set up CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],  # Adjust origins as needed
    allow_methods=["*"],
    allow_headers=["*"],
)

mongodb_uri = os.getenv('Mongo_URI') #retrieve mongodb uri from .env file

try:
    db_client = MongoClient(mongodb_uri, tlsCAFile=certifi.where()) 
    db = db_client.get_database("movies") 
    movieDetails = db.get_collection("movieDetails")
    db_client.server_info() 
    print("Connected successfully to the 'Movies' database!")
    
    posterDetails = db.get_collection("posterDetails")
    print("Connected successfully to the 'Posters' database!")
    
    movieEmbeddings = db.get_collection("movieEmbeddings")
    print("Connected successfully to the 'Movie Embeddings' database!")
    
except Exception as e:
    print(f"Could not connect to MongoDB: {e}")
    exit(1)

embedding_model = SentenceTransformer('all-MiniLM-L6-v2')

# Function to build FAISS index
def build_faiss_index(embeddings):
    d = embeddings.shape[1]
    index = faiss.IndexFlatL2(d)
    index.add(embeddings)
    return index

# Request body for plot and genre input
class MovieQuery(BaseModel):
    plot: str
    genre: Optional[str] = None

# Endpoint to find similar movies
@app.post("/generate_prompt")
async def generate_prompt(query: MovieQuery):
    print("Received request:", query)
    print()
    plot_embedding = embedding_model.encode(query.plot).astype("float32")
    
    # Filter embeddings by genre if genre is provided
    filtered_embeddings = []
    filtered_imdb_ids = []
    
    # If a genre is called in query, only extract those with that genre in the list of genres
    if query.genre:
        cursor = movieEmbeddings.find({"genres": query.genre})
    else:
        cursor = movieEmbeddings.find()
    
    for movie in cursor:
        filtered_embeddings.append(movie["embedding"])
        filtered_imdb_ids.append(movie["imdbID"])
    
    if not filtered_embeddings:
        raise HTTPException(status_code=404, detail="No movies found for the selected genre")
    
    # Build FAISS index on filtered embeddings
    faiss_index = build_faiss_index(np.array(filtered_embeddings).astype("float32"))
    
    # Search for the top 5 closest movies
    _, indices = faiss_index.search(np.expand_dims(plot_embedding, axis=0), 5)
    top_n_ids = [filtered_imdb_ids[i] for i in indices[0]]
    
    # Fetch movie titles and directors
    titles_and_directors = {}
    movies_cursor = movieDetails.find({"imdbID": {"$in": top_n_ids}}, {"title": 1, "director": 1, "imdbID": 1})
    for movie in movies_cursor:
        imdbID = movie["imdbID"]
        titles_and_directors[imdbID] = {
            "title": movie.get("title", "unknown title"),
            "director": movie.get("director", "unknown director")
        }
    
    # Create description using the top movies
    top_movies_description = ""
    top_movies_dict = {}
    for imdbID, details in titles_and_directors.items():
        title = details.get("title", "unknown title")
        director = details.get("director", "unknown director")
        if top_movies_description:
            top_movies_description += ", "
        top_movies_description += f"{title} by {director}"
        top_movies_dict[title] = director
    
    # Create prompt for Flux API
    if query.style == "Illustration (Animated)":
        prompt = f"Create a poster for a movie with this plot: {query.plot}. The top 5 closest movies are {top_movies_description}. Generate a poster that is in a style of flat-image illustration style. The text '{query.title}' must be clearly visible as the title."
        
        # if we manage to train and fine tune our own image generator on the posters we have in our db, the below command might produce better results 
        # prompt = f"Create a poster that's closest to the posters for these movies: {top_movies_description}. Generate a poster that is in a style of flat-image illustration style. The text '{query.title}' must be clearly visible as the title."
    else:
        prompt = f"Create a poster for a movie with this plot: {query.plot}. The top 5 closest movies are {top_movies_description}. Generate a poster that stylistically resembles the posters for these movies. The text '{query.title}' must be clearly visible as the title."
        
        # if we manage to train and fine tune our own image generator on the posters we have in our db, the below command might produce better results
        # prompt = f"Create a poster that's closest to the posters for these movies: {top_movies_description}. The text '{query.title}' must be clearly visible as the title."
    
    print(f"Generated Prompt: {prompt}")
    
    return {"imdbIDs": top_n_ids, "movieTitles": top_movies_dict, "prompt": prompt}
    
    
@app.get("/get_available_genres")
async def get_available_genres():
    '''This function will get all the values of unique genre values that can be found under the genres field and return them in a list'''
    
    # Initialize an empty set to collect unique genres
    unique_genres = set()
    
    # Query the movieEmbeddings collection to retrieve all genres
    cursor = movieEmbeddings.find({}, {"genres": 1})  # Only fetch the 'genres' field

    # Iterate over each document to add genres to the set
    for document in cursor:
        genres = document.get("genres", [])
        unique_genres.update(genres)  # Add each genre to the set

    # Convert the set to a sorted list and return it
    return sorted(unique_genres)