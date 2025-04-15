// src/components/SubmitButton.js
import React from 'react';

const SubmitButton = ({ onClick }) => {
    return (
        <button className="submit-button" onClick={onClick}>
            <span className="icon">🚀</span>
            <span className="text">Submit Solution</span>
        </button>
    );
};

export default SubmitButton;