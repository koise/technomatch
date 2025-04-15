// src/components/CodeArenaComponents/SettingsDropdown.js

import React from 'react';
import Select from 'react-select';
import { FaPython, FaJava } from 'react-icons/fa';
import { SiC } from 'react-icons/si';

const languageOptions = [
    { value: 'Python', label: <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><FaPython /> Python</div> },
    { value: 'Java', label: <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><FaJava /> Java</div> },
    { value: 'C', label: <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><SiC /> C</div> },
];

const SettingsDropdown = ({ language, setLanguage, fontSize, setFontSize, fontFamily, setFontFamily, handleSurrender }) => (
    <div className="settings-dropdown">
        <h3>Editor Settings</h3>
        <label>
            <span>Language:</span>
            <Select
                className="language-select"
                value={languageOptions.find(opt => opt.value === language)}
                onChange={(selected) => setLanguage(selected.value)}
                options={languageOptions}
                isSearchable={false}
            />
        </label>

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

        <label>
            <span>Font Family:</span>
            <select value={fontFamily} onChange={(e) => setFontFamily(e.target.value)}>
                <option value="Courier New">Courier New</option>
                <option value="Consolas">Consolas</option>
                <option value="Monaco">Monaco</option>
                <option value="Roboto Mono">Roboto Mono</option>
            </select>
        </label>

        <button className="surrender-button" onClick={handleSurrender}>
            Surrender
        </button>
    </div>
);

export default SettingsDropdown;
