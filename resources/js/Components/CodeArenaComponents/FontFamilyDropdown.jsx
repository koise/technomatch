import React from 'react';

const FontFamilyDropdown = ({ fontFamily, setFontFamily }) => {
    return (
        <label>
            <span>Font Family:</span>
            <select value={fontFamily} onChange={(e) => setFontFamily(e.target.value)}>
                <option value="Courier New">Courier New</option>
                <option value="Consolas">Consolas</option>
                <option value="Monaco">Monaco</option>
                <option value="Roboto Mono">Roboto Mono</option>
            </select>
        </label>
    );
};

export default FontFamilyDropdown;
