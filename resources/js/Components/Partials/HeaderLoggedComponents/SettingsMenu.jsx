import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FiSettings } from 'react-icons/fi';

const SettingsMenu = ({ 
  darkMode, 
  fontFamily, 
  userStatus, 
  handleToggleTheme, 
  handleFontChange,
  toggleOnlineStatus 
}) => {
  // State
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  
  // Refs
  const settingsMenuRef = useRef(null);
  
  // Font options
  const fontOptions = [
    { name: "System UI", value: "var(--font-sans)" },
    { name: "Serif", value: "var(--font-serif)" },
    { name: "Monospace", value: "var(--font-mono)" }
  ];
  
  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (settingsMenuRef.current && !settingsMenuRef.current.contains(event.target)) {
        setShowSettingsMenu(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Toggle settings menu
  const toggleSettingsMenu = useCallback(() => {
    setShowSettingsMenu(prev => !prev);
  }, []);

  return (
    <div className="dropdown-container" ref={settingsMenuRef}>
      <button 
        onClick={toggleSettingsMenu}
        className="icon-button settings-button"
        aria-label="Settings"
      >
        <FiSettings className="icon" />
      </button>

      {/* Settings Dropdown */}
      {showSettingsMenu && (
        <div className="dropdown-menu settings-menu">
          <div className="dropdown-header">
            <h3>Settings</h3>
          </div>
          
          {/* Theme Section */}
          <div className="settings-section">
            <h4>Theme</h4>
            <div className="setting-item">
              <span>Dark Mode</span>
              <button 
                onClick={handleToggleTheme}
                className={`toggle-switch ${darkMode ? 'active' : ''}`}
                aria-label={darkMode ? "Turn off dark mode" : "Turn on dark mode"}
              >
                <span className="toggle-knob"></span>
              </button>
            </div>
          </div>
          
          {/* Font Section */}
          <div className="settings-section">
            <h4>Font</h4>
            <div className="font-options">
              {fontOptions.map(font => (
                <button
                  key={font.name}
                  onClick={() => handleFontChange(font.value)}
                  className={`font-option ${fontFamily === font.value ? 'active' : ''}`}
                >
                  {font.name}
                </button>
              ))}
            </div>
          </div>
          
          {/* Online Status Section */}
          <div className="settings-section">
            <h4>Status</h4>
            <div className="setting-item">
              <span>Online Status</span>
              <button 
                onClick={toggleOnlineStatus}
                className={`toggle-switch ${userStatus === 'online' ? 'active' : ''}`}
                disabled={userStatus !== 'online' && userStatus !== 'offline'}
                aria-label={userStatus === 'online' ? "Set status to offline" : "Set status to online"}
              >
                <span className="toggle-knob"></span>
              </button>
            </div>
          </div>
          
          <div className="settings-footer">
            <a href="/account-settings">More settings</a>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsMenu;