import React from 'react';

function PromptInput({onPlotChange, onTitleChange}) {
  const handlePlotChange = (event) => {
    onPlotChange(event.target.value)
  }
  const handleTitleChange = (event) => {
    onTitleChange(event.target.value)
  }

  
  return (
    <div className="prompt-input">
      <input 
        onChange={handleTitleChange}
        placeholder="Please Enter Movie Title">
        </input>
      <textarea 
        onChange={handlePlotChange}
        placeholder="Please Write the Synopsis of Your Movie" 
        rows="5"></textarea>
      <div className="button-container">
        <button>Edit</button>
      </div>
    </div>
  );
}

export default PromptInput;
