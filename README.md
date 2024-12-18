# Poster Stormer

**Poster Stormer** is a web application that generates movie posters based on user-input prompts. Using React for the frontend and FastAPI for the backend, the app allows users to specify genres, decades, and styles for poster generation. It dynamically recommends similar movie posters based on the user’s input.

## Table of Contents

- [Poster Stormer](#poster-stormer)
  - [Table of Contents](#table-of-contents)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Running the App](#running-the-app)
  - [How to Use](#how-to-use)
  - [Design Choices](#design-choices)
    - [App Purpose and Functionality](#app-purpose-and-functionality)
    - [User Interface Layout](#user-interface-layout)
    - [Design Choices Justification](#design-choices-justification)
  - [Components](#components)
    - [App.js](#appjs)
    - [PromptInput](#promptinput)
    - [AdditionalOptions](#additionaloptions)
  - [Backend API](#backend-api)
    - [/generate\_prompt](#generate_prompt)
    - [/get\_available\_genres](#get_available_genres)
  - [Use of AI](#use-of-ai)  

## Getting Started

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (version 14 or later)
- [npm](https://www.npmjs.com/) (Node package manager, comes with Node.js)
- [Python](https://www.python.org/) (version 3.8 or later)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/zainab-hsini/poster-stormer.git
   cd poster-stormer
   ```

2. Install the frontend dependencies:

   ```bash
   npm install
   ```

3. Install the backend dependencies:

   ```bash
   pip install -r requirements.txt
   ```

4. Set up environment variables:
   - For the backend, add a `.env` file in the `backend` folder with the following variables:
     ```plaintext
     Mongo_URI=<Your MongoDB connection string>
     ```
   - For the frontend, add a `.env` file in the root directory with the following:
     ```plaintext
     REACT_APP_FAL_KEY=<Your FAL API key>
     ```

### Running the App

1. Start the backend server:
   ```bash
   uvicorn backend.embeddingsFetch:app --reload
   ```
   The backend server will start at `http://127.0.0.1:8000`.

2. Start the frontend server:
   ```bash
   npm start
   ```
   This command will start the React development server, and you can view the app in your browser at `http://localhost:3000`.

This will create an optimized production build in the `build` folder.

## How to Use

1. **Input a Prompt**: In the `PromptInput` section, type a description for your movie plot (i.e., one-paragraph synopsis) to inspire the poster generation.
2. **Select Additional Options (WiP)**: 
   - **Genre**: Choose a genre from the dropdown menu to filter similar movies by genre.
   - **Decade**: Specify the decade for the poster style (e.g., "1980s").
   - **Number of Posters**: Choose how many posters you want to generate (up to 10).
   - **Style**: Enter a style (e.g., "Retro").
3. **Generate Posters**: Click the "Generate" button to view the poster based on the selected criteria.
4. **Navigate Posters (WiP)**: Use the "Previous" and "Next" buttons to browse through the generated posters.

## Design Choices

### App Purpose and Functionality

- **Primary Purpose**: The app enables users to generate movie posters based on a brief movie plot description.
- **Additional Features**: Users can expand the interface to add specific indicators like genre, style, and decade for a more customized poster generation experience.

### User Interface Layout

- **Simple Plot Input (Left Panel)**: The primary input area where users type their movie plot. This minimal design choice focuses on simplicity, allowing users to directly enter the plot idea without distraction. There is also the option to edit the prompt for ease of use.
- **Advanced Options Dropdown**: Users have the option to expand for additional features, keeping the interface clean and npt overwhelming for basic use but allowing advanced customization for users who want more control over the output.
  - **Genre (Dropdown)**: Users can select a genre for the poster, offering genre-specific aesthetic influences on the poster's design. A dropdown allows the app to be more precise in the output as it gives the product more control.
  - **Number of Posters**: Allows users to specify how many posters they’d like generated, adding flexibility for those who want multiple options to compare.
  - **Decade**: Helps users set a time period, allowing the poster style to reflect the visual trends of a particular era.
  - **Style**: Provides an additional stylistic indicator, possibly to reflect a specific art style (e.g., minimalism, realism).

### Design Choices Justification

- **Expandable Advanced Options**: Keeps the main interface uncluttered, making it user-friendly for those who want a straightforward experience while still accommodating advanced customization.
- **Two-Panel Layout**: Separating input and output into distinct panels helps users intuitively understand where to start (left panel) and where to look for results (right panel).
- **Consistent Grayscale Scheme in Wireframe**: For the wireframe, this choice maintains focus on layout and functionality rather than aesthetic color choices, ensuring clarity in the structure and information flow.

## Components

### App.js

`App.js` is the main component of the application. It manages the state and structure of the app.

- **State Variables**:
  - `numberOfPosters`: Tracks the number of posters requested by the user.
  - `postersToDisplay`: Holds the array of generated posters.
  - `currentIndex`: Tracks the current poster displayed.
  - `inputValue`: Stores the user’s input for the movie plot.

- **Functions**:
  - `handleGenerate`: Calls the backend `/generate_prompt` endpoint, then uses the Flux API to generate the poster based on the returned prompt.
  - `handleNext` and `handlePrev`: Navigate through the list of generated posters, updating `currentIndex`.

- **Components Used**:
  - `<PromptInput />`: The text input for the movie plot.
  - `<AdditionalOptions />`: Displays the genre, decade, and style selectors.
  - `<PosterDisplay />`: Displays the generated poster with navigation buttons.

### PromptInput

Located in `Components/PromptInput.js`

This component provides a text area for users to type in their movie prompt.

- **Description**: 
  - Renders a text area for prompt input with a placeholder text "Type your movie prompt here."
  - Includes an "Edit" button for potential additional editing features.

- **Styling**: Defined in `PromptInput.css`.

### AdditionalOptions

Located in `Components/AdditionalOptions.js`

This component renders additional options for poster generation, including genre, decade, number of posters, and style.

- **Props**:
  - `setNumberOfPosters`: Function to update the number of posters requested by the user.

- **Options**:
  - **Genre**: Dropdown menu with a list of genres.
  - **Decade**: Input field where users can specify a decade.
  - **Number of Posters**: Numeric input allowing users to select how many posters to generate.
  - **Style**: Input for specifying a style.

- **Styling**: Defined in `AdditionalOptions.css`.

## Backend API

The backend is powered by FastAPI and includes endpoints to generate prompts based on user input and retrieve available genres.

### /generate_prompt

- **Method**: `POST`
- **Endpoint**: `/generate_prompt`
- **Description**: Generates a prompt based on the user's plot description and selected genre.
- **Request Body**:
  ```json
  {
    "plot": "A thrilling sci-fi adventure in space.",
    "genre": "Sci-Fi"
  }
  ```
- **Response**:
  - Returns the top 5 most similar movies to the plot, based on their embedding similarity, along with a prompt for generating a poster via the Flux API.
  ```json
  {
    "imdbIDs": ["tt1234567", "tt2345678", "tt3456789", "tt4567890", "tt5678901"],
    "movieTitles": ["Movie 1", "Movie 2", "Movie 3", "Movie 4", "Movie 5"],
    "prompt": "Create a poster for a movie with this plot: A thrilling sci-fi adventure in space. The top 5 closest movies are Movie 1, Movie 2, Movie 3, Movie 4, Movie 5."
  }
  ```

### /get_available_genres

- **Method**: `GET`
- **Endpoint**: `/get_available_genres`
- **Description**: Retrieves all unique genres available in the `movieEmbeddings` collection.
- **Response**:
  - Returns a list of unique genres, such as:
    ```json
    [
      "Action",
      "Comedy",
      "Drama",
      "Fantasy",
      "Horror",
      "Romance",
      "Thriller"
    ]
    ```
## Use of AI
Throughout development, we utilized ChatGPT to assist with:

Writing and explaining JavaScript functions.
Structuring components and organizing the code for readability.
Error handling when fetching data from the API and generating user feedback messages.
All AI-generated code snippets were reviewed, modified, and understood before incorporation.
