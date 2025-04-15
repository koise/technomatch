// src/components/SubmitButton.js
import React from 'react';
import '../../../scss/Components/CodeArena/SubmitButton.scss';
const SubmitButton = ({ onClick, isLoading }) => {
    return (
        <button className="submit-button" onClick={onClick} disabled={isLoading}>
            {isLoading ? (
                <div className="spinner small"></div>
            ) : (
                <>
                    <span className="icon">🚀</span>
                    <span className="text">Submit Solution</span>
                </>
            )}
        </button>
    );
};

export default SubmitButton;
