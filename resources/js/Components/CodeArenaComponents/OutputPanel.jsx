import React from 'react';

const OutputPanel = ({ output = '', expected = '', input = '' }) => {
    return (
        <div className="output-panel">
            <p><strong>Input:</strong> {input}</p>
            <p><strong>Output:</strong> {output}</p>
            <p><strong>Expected:</strong> {expected}</p>
        </div>
    );
};

export default OutputPanel;
