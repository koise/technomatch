import React from 'react';

const SurrenderModal = React.forwardRef(({ showModal, onConfirm, onCancel }, ref) => {
    if (!showModal) return null;

    return (
        <div className="surrender-modal">
            <div className="modal-content" ref={ref}>
                <h2>Confirm Surrender</h2>
                <p>Are you sure you want to surrender? Your score will not be recorded.</p>
                <div className="modal-actions">
                    <button onClick={onConfirm}>Yes, Surrender</button>
                    <button onClick={onCancel}>Cancel</button>
                </div>
            </div>
        </div>
    );
});

export default SurrenderModal;
