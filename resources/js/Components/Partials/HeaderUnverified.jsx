import React, { useState, useEffect } from 'react';
import { FiSun, FiMoon, FiSettings, FiUser, FiBell, FiLogOut, FiChevronDown, FiCheck, FiX, FiMail } from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';
import '../../../scss/Components/Partials/HeaderLogged.scss';

const HeaderUnverified = ({ user }) => {
  const { darkMode, toggleTheme } = useTheme();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [showVerificationBanner, setShowVerificationBanner] = useState(true);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendSuccess, setResendSuccess] = useState(false);
  
  const userData = user || {
    name: "Bart Jason Edades",
    avatar: '/avatar/default-7.svg',
    username: "koise",
  };

  // Handle resend cooldown timer
  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [resendCooldown]);

  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
    if (showSettingsMenu) setShowSettingsMenu(false);
  };

  const toggleSettingsMenu = () => {
    setShowSettingsMenu(!showSettingsMenu);
    if (showProfileMenu) setShowProfileMenu(false);
  };

  const handleResendVerification = () => {
    setTimeout(() => {
      setResendSuccess(true);
      setResendCooldown(60);s
      setTimeout(() => {
        setResendSuccess(false);
      }, 5000);
    }, 1000);
  };

  const dismissBanner = () => {
    setShowVerificationBanner(false);
  };

  return (
    <>
      {showVerificationBanner && (
        <div className="verification-banner">
          <div className="verification-banner-content">
            <FiMail className="verification-icon" />
            <div className="verification-message">
              <p><strong>Please verify your email address</strong></p>
              <p>We've sent a verification link to <strong>{userData.email}</strong></p>
            </div>
            <div className="verification-actions">
              {resendSuccess ? (
                <span className="resend-success">
                  <FiCheck className="success-icon" /> Email sent successfully!
                </span>
              ) : resendCooldown > 0 ? (
                <span className="cooldown-timer">Resend available in {resendCooldown}s</span>
              ) : (
                <button 
                  className="resend-button"
                  onClick={handleResendVerification}
                >
                  Resend email
                </button>
              )}
              <button className="dismiss-button" onClick={dismissBanner}>
                <FiX className="dismiss-icon" />
              </button>
            </div>
          </div>
        </div>
      )}

      <header className="technomatch-header unverified">
        <div className="header-container">
          {/* Logo */}
          <div className="logo-section">
            <a href="/dashboard" className="logo">
              <span className="logo-primary">Techno</span>
              <span className="logo-secondary">Match</span>
            </a>
          </div>

          <nav className="nav-links">
            <a href="/dashboard" className="nav-link">Dashboard</a>
            <a href="/classes" className="nav-link">Classes</a>
            
            <div className="game-play-container">
              <button 
                className="play-button disabled"
                disabled={true}
                title="Email verification required to play"
              >
                <span className="verification-lock">
                  <FiMail className="lock-icon" />
                </span>
                <span className="play-text">Verify to Play</span>
              </button>
            </div>
            
            <a href="/leaderboard" className="nav-link">Leaderboard</a>
            <a href="/store" className="nav-link disabled" title="Email verification required">Store</a>
          </nav>

          <div className="header-actions">


            <div className="dropdown-container">
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
                        onClick={toggleTheme}
                        className={`toggle-switch ${darkMode ? 'active' : ''}`}
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

            {/* User Profile */}
            <div className="dropdown-container">
              <button 
                onClick={toggleProfileMenu}
                className="profile-button"
                aria-label="User profile"
              >
                <div className="avatar-container">
                  <img src={userData.avatar} alt="User avatar" className="avatar" />
                  <div className="status-indicator unverified"></div>
                </div>
                <span className="user-name">{userData.name}</span>
                <FiChevronDown className="dropdown-icon" />
              </button>

              {/* Profile Dropdown */}
              {showProfileMenu && (
                <div className="dropdown-menu profile-menu">
                  <div className="profile-header">
                    <div className="avatar-container large">
                      <img src={userData.avatar} alt="User avatar" className="large-avatar" />
                      <div className="status-indicator large unverified"></div>
                    </div>
                    <div className="profile-info">
                      <h3>{userData.name}</h3>
                      <p className="username">@{userData.username}</p>
                      <div className="verification-status">
                        <FiMail className="verification-icon" />
                        <span>Email not verified</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Limited Profile Info */}
                  <div className="profile-section">
                    <h4>Account Details</h4>
                    <div className="account-details">
                      <div className="detail-item">
                        <span className="detail-label">Email:</span>
                        <span className="detail-value">{userData.email}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">School:</span>
                        <span className="detail-value">{userData.school}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="profile-actions">
                    <a href="/profile" className="profile-action">
                      <FiUser className="action-icon" />
                      My Profile
                    </a>
                    <a href="/settings" className="profile-action">
                      <FiSettings className="action-icon" />
                      Account Settings
                    </a>
                    <a href="/logout" className="profile-action logout">
                      <FiLogOut className="action-icon" />
                      Log Out
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default HeaderUnverified;