// src/components/TerminalButton.js
import React from 'react';

const TerminalButton = ({ onClick }) => {
    return (
        <button className="terminal-button" onClick={onClick}>
            <span className="icon">▶️</span>
            <span className="text">Run Code</span>
        </button>
    );
};

export default TerminalButton;

