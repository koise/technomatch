// src/components/TerminalButton.js
import React from 'react';

const TerminalButton = ({ onClick, loading }) => {
    return (
        <button
            className="terminal-button"
            onClick={onClick}
            disabled={loading}
        >
            {loading ? (
                <div className="spinner small-spinner"></div>
            ) : (
                <>
                    <span className="icon">▶️</span>
                    <span className="text">Run Code</span>
                </>
            )}
        </button>
    );
};

export default TerminalButton;
