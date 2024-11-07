import React from 'react';

function PosterDisplay({ poster, onNext, onPrev, canNext, canPrev }) {
  return (
    <div className="poster-display">
      {poster ? (
        <div className="poster-placeholder">
          <img src={poster.image} alt={poster.title} style={{ width: '100%', height: 'auto' }} />
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
