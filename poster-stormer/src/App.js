import React, { useState } from 'react';
import './App.css';
import PromptInput from './Components/PromptInput';
import AdditionalOptions from './Components/AdditionalOptions';
import PosterDisplay from './Components/PosterDisplay';
import mockPosters from './mockData'; // Adjust the path if necessary

function App() {
  const [numberOfPosters, setNumberOfPosters] = useState(0);
  const [postersToDisplay, setPostersToDisplay] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0); // State to track the current poster index

  const handleGenerate = () => {
    const selectedPosters = mockPosters.slice(0, numberOfPosters); // Get the first n posters
    setPostersToDisplay(selectedPosters);
    setCurrentIndex(0); // Reset to the first poster
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
          <PromptInput />
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
