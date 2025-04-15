// src/Components/SurrenderModal.js

import React from 'react';


const SurrenderModal = ({ onClose, onConfirm }) => {
    return (
        <div className="surrender-modal-overlay">
            <div className="surrender-modal">
                <h2>Game Over</h2>
                <p>You have surrendered. Your score will not be recorded.</p>
                <div className="modal-buttons">
                    <button className="close-btn" onClick={onClose}>Close</button>
                    <button className="confirm-btn" onClick={onConfirm}>Confirm</button>
                </div>
            </div>
        </div>
    );
};

export default SurrenderModal;
