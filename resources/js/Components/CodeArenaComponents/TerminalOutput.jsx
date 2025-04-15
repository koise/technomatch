// src/components/TerminalOutput.js
import React from 'react';

const TerminalOutput = ({ output }) => {
    const lines = output.split('\n');
    
    return (
        <div className="terminal-output">
            <div className="terminal-content">
                {lines.map((line, index) => (
                    <div 
                        key={index} 
                        className={`terminal-line ${line.includes('Passed') ? 'success' : line.includes('Failed') ? 'error' : ''}`}
                    >
                        {line}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TerminalOutput;