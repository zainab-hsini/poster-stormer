import React, { useState, useEffect } from 'react';
import './App.css';
import PromptInput from './Components/PromptInput';
import AdditionalOptions from './Components/AdditionalOptions';
import PosterDisplay from './Components/PosterDisplay';
import { fal } from "@fal-ai/client";

function App() {
  const [numberOfPosters, setNumberOfPosters] = useState(0);
  const [postersToDisplay, setPostersToDisplay] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [plotValue, setPlotValue] = useState('');
  const [titleValue, setTitleValue] = useState('');
  const [genreValue, setGenreValue] = useState('');
  const [loading, setLoading] = useState(false); // State to track loading progress

  const handlePlotChange = (value) => {
    setPlotValue(value);
    //can i just add more setInputValues to change
    //so it would change to inputPlotValue, inputTitleValue, inputGenreValue, inputStyleValue
  };
  const handleTitleChange = (value) => {
    setTitleValue(value);
  }
  const handleGenreChange = (value) => {
    setGenreValue(value);
  }

  const getPosterDescription = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/generate_prompt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: titleValue,
          plot: plotValue,
          genre: genreValue,
          style: "Illustration (Animated)",
          isRetro: false
        }),
      });

      if (!response.ok) throw new Error("failed to get poster description");
      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    const description = await getPosterDescription();
    if (!description || !description.prompt) {
      alert("failed to get description.");
      setLoading(false);
      return;
    }

    const FAL_KEY = process.env.REACT_APP_FAL_KEY;
    fal.config({
      credentials: FAL_KEY
    });

    const result = await fal.subscribe("fal-ai/flux/dev", {
      input: {
        "prompt": description.prompt,
        "num_images": 1,
        "image_size": "portrait_4_3"
      },
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS") {
          update.logs.map((log) => log.message).forEach(console.log);
        }
      },
    });

    if (result.data && result.data.images && result.data.images.length) {
      const posters = result.data.images.map((item) => {
        return { image: item.url };
      });
      setPostersToDisplay(posters);
      setCurrentIndex(0);
    }
    setLoading(false);
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
      <header className="app-header">Poster Stormer</header>
      <div className="app-content">
        <div className="left-section">
          <PromptInput onPlotChange={handlePlotChange} onTitleChange={handleTitleChange}/>
          <AdditionalOptions setNumberOfPosters={setNumberOfPosters} onGenreChange={handleGenreChange}/>
          <button onClick={handleGenerate}>Generate</button>
        </div>

        {loading && (
          <div className="progress-bar-container">
            <div className="progress-bar"></div>
          </div>
        )}

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
