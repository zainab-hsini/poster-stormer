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
      <div>
        <input 
        onChange={handleTitleChange}
        placeholder="Please Enter Movie Title">
        </input>
      </div>
      <div>
        <textarea 
        onChange={handlePlotChange}
        placeholder="Please Write the Synopsis of Your Movie" 
        rows="5">
        </textarea>
      </div>
    </div>
  );
}

export default PromptInput;
