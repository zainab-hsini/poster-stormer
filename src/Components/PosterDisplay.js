import React, { useEffect } from 'react';

function PosterDisplay({ poster, onNext, onPrev, canNext, canPrev, posterRef }) {
  
  // This function will handle the scrolling logic once the image is loaded
  const handleImageLoad = () => {
    if (posterRef && posterRef.current) {
      const posterTop = posterRef.current.getBoundingClientRect().top + window.scrollY;
      const windowHeight = window.innerHeight;
      const posterHeight = posterRef.current.offsetHeight;
      const scrollPosition = posterTop - windowHeight / 2 + posterHeight / 2;

      // Scroll to the calculated position with smooth behavior
      window.scrollTo({ top: scrollPosition, behavior: 'smooth' });
    }
  };

  return (
    <div className="poster-display" ref={posterRef}>
      {poster ? (
        <div className="poster-placeholder">
          <img 
            src={poster.image} 
            alt={poster.title} 
            style={{ width: '100%', height: 'auto' }} 
            onLoad={handleImageLoad}  // Trigger scroll after image is loaded
          />
          <p>{poster.title}</p>
        </div>
      ) : (
        <p>No posters to display. Please generate some!</p>
      )}
      <div className="navigation">
        <button onClick={onPrev} disabled={!canPrev}>&lt; Previous</button>
        <button onClick={onNext} disabled={!canNext}>Next &gt;</button>
      </div>
    </div>
  );
}

export default PosterDisplay;
