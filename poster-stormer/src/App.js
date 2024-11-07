import React, { useState } from 'react';
import './App.css';
import PromptInput from './Components/PromptInput';
import AdditionalOptions from './Components/AdditionalOptions';
import PosterDisplay from './Components/PosterDisplay';
import { fal } from "@fal-ai/client";

function App() {
  const [numberOfPosters, setNumberOfPosters] = useState(0);
  const [postersToDisplay, setPostersToDisplay] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0); // State to track the current poster index
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (value) => {
    setInputValue(value);
  };

  const handleGenerate = async () => {
    const FAL_KEY = process.env.REACT_APP_FAL_KEY;
    console.log("handling generation")
    fal.config({
      credentials: FAL_KEY
    });
    const result = await fal.subscribe("fal-ai/flux/dev", {
      input: {
        "prompt": inputValue,
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
