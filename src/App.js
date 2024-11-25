import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import PromptInput from './Components/PromptInput';
import './Components/PromptInput.css';
import AdditionalOptions from './Components/AdditionalOptions';
import './Components/AdditionalOptions.css';
import PosterDisplay from './Components/PosterDisplay';
import './Components/PosterDisplay.css';
import { fal } from "@fal-ai/client";

function App() {
  const [numberOfPosters, setNumberOfPosters] = useState(0);
  const [postersToDisplay, setPostersToDisplay] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [plotValue, setPlotValue] = useState('');
  const [titleValue, setTitleValue] = useState('');
  const [genreValue, setGenreValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingPercentage, setLoadingPercentage] = useState(0);
  const [loadingMovies, setLoadingMovies] = useState([]);
  const posterRef = useRef(null);

  const handlePlotChange = (value) => {
    setPlotValue(value);
  };
  const handleTitleChange = (value) => {
    setTitleValue(value);
  };
  const handleGenreChange = (value) => {
    setGenreValue(value);
  };

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
          isRetro: false,
        }),
      });

      if (!response.ok) throw new Error("Failed to get poster description");
      const result = await response.json();

      // Handle loading updates
      const updates = result.loadingUpdates || [];
      for (let i = 0; i < updates.length; i++) {
        setTimeout(() => {
          setLoadingMovies((prev) => [...prev, updates[i]]);
          setLoadingPercentage(Math.min((i + 1) * (100 / updates.length), 100));
        }, i * 500); // Adjust delay for updates
      }

      return result;
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    setLoadingMovies([]);
    setLoadingPercentage(0);
    const description = await getPosterDescription();
    if (!description || !description.prompt) {
      alert("Failed to get description.");
      setLoading(false);
      return;
    }

    const FAL_KEY = process.env.REACT_APP_FAL_KEY;
    fal.config({
      credentials: FAL_KEY,
    });

    const result = await fal.subscribe("fal-ai/flux/dev", {
      input: {
        prompt: description.prompt,
        num_images: 1,
        image_size: "portrait_4_3",
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
    setLoadingPercentage(100);
  };

  useEffect(() => {
    if (postersToDisplay.length > 0 && posterRef.current) {
      const poster = posterRef.current;
      const posterTop = poster.getBoundingClientRect().top + window.scrollY;
      const windowHeight = window.innerHeight;
      const posterHeight = poster.offsetHeight;
      const scrollPosition = posterTop - windowHeight / 2 + posterHeight / 2;

      window.scrollTo({ top: scrollPosition, behavior: 'smooth' });
    }
  }, [postersToDisplay, currentIndex]);

  return (
    <div className="app">
      <header className="app-header">Poster Stormer</header>
      <div className="app-content">
        <div className="input-section">
          <PromptInput onPlotChange={handlePlotChange} onTitleChange={handleTitleChange} />
          <AdditionalOptions setNumberOfPosters={setNumberOfPosters} onGenreChange={handleGenreChange} />
          <button onClick={handleGenerate} disabled={!titleValue || !plotValue}>
            Generate
          </button>
        </div>

        {loading && (
          <>
            <div className="progress-bar-container">
              <div className="progress-bar" style={{ width: `${loadingPercentage}%` }}></div>
              <div className="progress-text">{loadingPercentage}%</div>
            </div>
            <ul className="loading-movies">
              {loadingMovies.map((movie, index) => (
                <li key={index}>{movie}</li>
              ))}
            </ul>
          </>
        )}

        <div className="poster-display">
          <PosterDisplay
            poster={postersToDisplay[currentIndex]}
            posterRef={posterRef}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
