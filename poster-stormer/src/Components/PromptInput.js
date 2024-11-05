import React from 'react';

function PromptInput() {
  return (
    <div className="prompt-input">
      <textarea placeholder="Type your movie prompt here" rows="5"></textarea>
      <div className="button-container">
        <button>Edit</button>
      </div>
    </div>
  );
}

export default PromptInput;
