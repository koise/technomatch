import React, { useState, useEffect, useRef } from 'react';

const TerminalModal = ({ title, output, onClose, showModal }) => {
    const modalRef = useRef(null);
    const contentRef = useRef(null);

    useEffect(() => {
        // Scroll to bottom whenever new output is added
        if (contentRef.current) {
            contentRef.current.scrollTop = contentRef.current.scrollHeight;
        }

        // Close modal on Escape key
        const handleEscapeKey = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscapeKey);
        return () => document.removeEventListener('keydown', handleEscapeKey); // Clean up on unmount
    }, [output, onClose]);

    // Handle click outside to close
    const handleClickOutside = (e) => {
        if (modalRef.current && !modalRef.current.contains(e.target)) {
            onClose();
        }
    };

    const parseOutput = (text) => {
        if (!text) return null;  // Check if text is undefined or null

        return text.split('\n').map((line, index) => {
            if (line.includes('✓ Passed') || line.includes('successful') || line.includes('✅')) {
                return <div key={index} className="terminal-line success">{line}</div>;
            } else if (line.includes('Failed') || line.includes('Error') || line.includes('❌')) {
                return <div key={index} className="terminal-line error">{line}</div>;
            } else if (line.startsWith('> ')) {
                return <div key={index} className="terminal-line command">{line}</div>;
            } else if (line === '') {
                return <div key={index} className="terminal-line empty">&nbsp;</div>;
            } else {
                return <div key={index} className="terminal-line">{line}</div>;
            }
        });
    };

    return (
        <div 
            className={`terminal-modal-overlay ${showModal ? 'visible' : ''}`} 
            onClick={handleClickOutside} 
            style={{ display: showModal ? 'flex' : 'none' }} 
        >
            <div className="terminal-modal" ref={modalRef}>
                <div className="terminal-modal-header">
                    <div className="terminal-controls">
                        <span className="control red"></span>
                        <span className="control yellow"></span>
                        <span className="control green"></span>
                    </div>
                    <h3>{title}</h3>
                    <button className="close-button" onClick={onClose}>×</button>
                </div>
                <div className="terminal-modal-content" ref={contentRef}>
                    {parseOutput(output)}
                </div>
                <div className="terminal-modal-footer">
                    <button className="close-terminal-button" onClick={onClose}>Close Terminal</button>
                </div>
            </div>
        </div>
    );
};

export default TerminalModal;
