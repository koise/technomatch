// src/components/CodeArenaComponents/TerminalModal.js

import React from 'react';

const TerminalModal = ({ title, output, onClose }) => (
    <div className="terminal-modal">
        <h3>{title}</h3>
        <pre>{output}</pre>
        <button onClick={onClose}>Close</button>
    </div>
);

export default TerminalModal;
