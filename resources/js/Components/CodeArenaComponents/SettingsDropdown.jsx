// SettingsDropdown.js
import React from 'react';
import LanguageDropdown from './LanguageDropdown';
import FontSizeDropdown from './FontSizeDropdown';
import FontFamilyDropdown from './FontFamilyDropdown';

const SettingsDropdown = ({ showSettings, setShowSettings, language, setLanguage, fontSize, setFontSize, fontFamily, setFontFamily, settingsRef, handleSurrender }) => {
    return (
        showSettings && (
            <div className="settings-dropdown" ref={settingsRef}>
                <h3>Editor Settings</h3>
                <LanguageDropdown language={language} setLanguage={setLanguage} />
                <FontSizeDropdown fontSize={fontSize} setFontSize={setFontSize} />
                <FontFamilyDropdown fontFamily={fontFamily} setFontFamily={setFontFamily} />
                <button className="surrender-button" onClick={handleSurrender}>Surrender</button>
            </div>
        )
    );
};

export default SettingsDropdown;
