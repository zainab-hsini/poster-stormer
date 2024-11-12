import React, { useState, useEffect } from 'react';
import './App.css';
import PromptInput from './Components/PromptInput';
import AdditionalOptions from './Components/AdditionalOptions';
import PosterDisplay from './Components/PosterDisplay';
import { fal } from "@fal-ai/client";

function App() {
  const [numberOfPosters, setNumberOfPosters] = useState(0); //will be used later on
  const [postersToDisplay, setPostersToDisplay] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0); // State to track the current poster index
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (value) => {
    setInputValue(value);
  };
  
  const getPosterDescription = async () => {

    try {
      const response = await fetch("http://127.0.0.1:8000/generate_prompt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plot: inputValue,
          genre: "Sci-Fi", // Hardcoded for now but will be changed later to take in additional input --> will be framework for other additional filters
        }),
      });

      if (!response.ok) throw new Error("failed to get poster description");

      const result = await response.json();
      return result
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleGenerate = async () => { //This section calls the flux API to generate the poster
    const description = await getPosterDescription();
    if (!description || !description.prompt)
    {
      alert("failed to get description.");
      return;
    }
    const FAL_KEY = process.env.REACT_APP_FAL_KEY; //this section is to get the API key from the .env file
    console.log("handling generation")
    fal.config({
      credentials: FAL_KEY
    });
    const result = await fal.subscribe("fal-ai/flux/dev", { //This is the request to the flux API
      input: {
        "prompt": description.prompt, //Input value is currently taken from what the user inputs on the website
        "num_images": 1, //this can be changed later
        "image_size": "portrait_4_3"
      },
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS") {
          update.logs.map((log) => log.message).forEach(console.log);
          }
        },
      });
    if (result.data && result.data.images && result.data.images.length){
      const posters = result.data.images.map((item) => {
        return {
          image: item.url
        };
      });

      setPostersToDisplay(posters);
      setCurrentIndex(0); // Reset to the first poster
    } 
  };

  const handleNext = () => {
    if (currentIndex < postersToDisplay.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        Poster Stormer
      </header>
      <div className="app-content">
        <div className="left-section">
          <PromptInput onInputChange={handleInputChange}/>
          <AdditionalOptions setNumberOfPosters={setNumberOfPosters} />
          <button onClick={handleGenerate}>Generate</button>
        </div>
        <PosterDisplay 
          poster={postersToDisplay[currentIndex]} 
          onNext={handleNext} 
          onPrev={handlePrev} 
          canNext={currentIndex < postersToDisplay.length - 1}
          canPrev={currentIndex > 0}
        />
      </div>
    </div>
  );
}

export default App;
