// src/components/CodeArenaComponents/FontSizeDropdown.js

import React from 'react';

const FontSizeDropdown = ({ fontSize, setFontSize }) => {
    return (
        <label>
            <span>Font Size:</span>
            <select value={fontSize} onChange={(e) => setFontSize(parseInt(e.target.value))}>
                <option value={12}>12px</option>
                <option value={14}>14px</option>
                <option value={16}>16px</option>
                <option value={18}>18px</option>
                <option value={20}>20px</option>
            </select>
        </label>
    );
};

export default FontSizeDropdown;
