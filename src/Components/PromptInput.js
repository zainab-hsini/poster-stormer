import React from 'react';

function PromptInput({onInputChange}) {
  const handleMovieDescriptionChange = (event) => {
    onInputChange(event.target.value)
  }
  
  return (
    <div className="prompt-input">
      <textarea 
        onChange={handleMovieDescriptionChange}
        placeholder="Please Write the Synopsis of Your Movie" 
        rows="5"></textarea>
      <div className="button-container">
        <button>Edit</button>
      </div>
    </div>
  );
}

export default PromptInput;
