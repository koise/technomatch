import React, { useState, useEffect, useCallback } from 'react';
import { useTheme } from '../../context/ThemeContext';
import axios from 'axios';
import { FiAlertCircle } from 'react-icons/fi';
import '../../../scss/Components/Partials/HeaderLogged.scss';

import Logo from './HeaderLoggedComponents/Logo.jsx';
import Navigation from './HeaderLoggedComponents/Navigation.jsx';
import ProgressDisplay from './HeaderLoggedComponents/ProgressDisplay.jsx';
import CurrencyDisplay from './HeaderLoggedComponents/CurrencyDisplay.jsx';
import NotificationsMenu from './HeaderLoggedComponents/NotificationsMenu.jsx';
import SettingsMenu from './HeaderLoggedComponents/SettingsMenu.jsx';
import ProfileMenu from './HeaderLoggedComponents/ProfileMenu.jsx';

const HeaderLogged = () => {
  // Context and state
  const { darkMode, toggleTheme } = useTheme();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fontFamily, setFontFamily] = useState('var(--font-sans)');
  const [userStatus, setUserStatus] = useState('online');
  const [activeMode, setActiveMode] = useState('progressive');
  
  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/fetch-user');
        if (response.data && response.data.user) {
          setUserData(response.data.user);
          
          if (response.data.user.profile) {
            // Set font preference
            if (response.data.user.profile.preferred_font) {
              setFontFamily(response.data.user.profile.preferred_font);
            }
            
            // Set user status
            if (response.data.user.profile.online_status) {
              setUserStatus(response.data.user.profile.online_status);
            }

            // Set active game mode if available
            if (response.data.user.profile.game_mode) {
              setActiveMode(response.data.user.profile.game_mode);
            }
          }
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to load user data");
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Apply font family to document
  useEffect(() => {
    document.documentElement.style.setProperty('--applied-font', fontFamily);
  }, [fontFamily]);
  
  // Update user status in the backend
  const updateUserStatus = async (status) => {
    try {
      await axios.post('/update-user-status', { status });
    } catch (err) {
      console.error("Error updating user status:", err);
    }
  };
  
  // Update user preferences
  const updateUserPreference = async (preference, value) => {
    try {
      await axios.post('/update-user-preference', { preference, value });
    } catch (err) {
      console.error(`Error updating user ${preference}:`, err);
    }
  };
  
  // Toggle dark mode and save preference
  const handleToggleTheme = useCallback(() => {
    toggleTheme();
    updateUserPreference('dark_mode', !darkMode);
  }, [darkMode, toggleTheme]);
  
  // Update font preference
  const handleFontChange = useCallback((fontValue) => {
    setFontFamily(fontValue);
    updateUserPreference('preferred_font', fontValue);
  }, []);

  // Toggle user status between online and offline
  const toggleOnlineStatus = useCallback(() => {
    const newStatus = userStatus === 'online' ? 'offline' : 'online';
    setUserStatus(newStatus);
    updateUserStatus(newStatus);
  }, [userStatus]);
  
  // Game mode handling
  const handleGameModeChange = useCallback((mode) => {
    setActiveMode(mode);
    updateUserPreference('game_mode', mode);
  }, []);

  // Loading and error states
  if (loading) {
    return (
      <header className="technomatch-header">
        <div className="header-container loading-container">
          <Logo />
          <div className="loading-indicator">Loading user profile...</div>
        </div>
      </header>
    );
  }

  if (error) {
    return (
      <header className="technomatch-header">
        <div className="header-container error-container">
          <Logo />
          <div className="error-message">
            <FiAlertCircle className="error-icon" />
            Error: {error}
          </div>
        </div>
      </header>
    );
  }

  if (!userData) {
    return (
      <header className="technomatch-header">
        <div className="header-container error-container">
          <Logo />
          <div className="error-message">
            <FiAlertCircle className="error-icon" />
            No user data available
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="technomatch-header">
      <div className="header-container">
        {/* Logo */}
        <Logo />

        {/* Navigation with Play Button in the middle */}
        <Navigation 
          userStatus={userStatus} 
          setUserStatus={setUserStatus}
          activeMode={activeMode}
          onGameModeChange={handleGameModeChange}
          updateUserStatus={updateUserStatus}
        />

        <div className="header-actions">
          {/* Progress/Rank Display */}
          <ProgressDisplay 
            userData={userData}
            activeMode={activeMode}
          />

          {/* Currency Display */}
          <CurrencyDisplay 
            amount={userData.profile?.currency || 942}
          />

          {/* Notifications */}
          <NotificationsMenu />

          {/* Settings */}
          <SettingsMenu 
            darkMode={darkMode}
            fontFamily={fontFamily}
            userStatus={userStatus}
            handleToggleTheme={handleToggleTheme}
            handleFontChange={handleFontChange}
            toggleOnlineStatus={toggleOnlineStatus}
          />

          {/* User Profile */}
          <ProfileMenu 
            userData={userData}
            userStatus={userStatus}
          />
        </div>
      </div>
    </header>
  );
};

export default HeaderLogged;