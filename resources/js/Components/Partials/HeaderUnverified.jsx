import React, { useState, useEffect } from 'react';
import { FiSun, FiMoon, FiSettings, FiUser, FiLogOut, FiChevronDown, FiMail, FiAlertCircle } from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';
import '../../../scss/Components/Partials/HeaderLogged.scss';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const HeaderUnverified = ({ refreshUser }) => {
  const { darkMode, toggleTheme } = useTheme();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [showVerificationBanner, setShowVerificationBanner] = useState(true);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendLoading, setResendLoading] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    axios.get('/fetch-user')
      .then(response => {
        setUserData(response.data.user);
        console.log(response.data.user);
        if (response.data.user && response.data.user.email_verified) {
          setShowVerificationBanner(false);
        }
      })
      .catch(error => {
        console.error('Error fetching user:', error);
      });
  }, []);

  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setTimeout(() => {
        setResendCooldown(prev => prev - 1);
      }, 1000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [resendCooldown]);

  if (!userData) return null;

  const toggleProfileMenu = () => {
    setShowProfileMenu(prev => !prev);
    if (showSettingsMenu) setShowSettingsMenu(false);
  };

  const toggleSettingsMenu = () => {
    setShowSettingsMenu(prev => !prev);
    if (showProfileMenu) setShowProfileMenu(false);
  };

  const handleResendVerification = async () => {
    if (resendCooldown > 0 || resendLoading) return;
    
    setResendLoading(true);
    
    try {
      const response = await axios.post('/send-verification-code', { 
        email: userData.email 
      });
      
      if (response.data.sent) {
        toast.success('Verification code sent successfully!', {
          position: "bottom-left",
          autoClose: 3000,
        });
        setResendCooldown(60); 
        if (refreshUser) {
          refreshUser();
        }
      }
    } catch (error) {
      console.error('Error sending verification code:', error);
      let errorMessage = 'Failed to send verification code.';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      toast.error(errorMessage, {
        position: "bottom-left",
        autoClose: 3000,
      });
    } finally {
      setResendLoading(false);
    }
  };

  const dismissBanner = () => {
    setShowVerificationBanner(false);
  };

  return (
    <>
      {!userData.email_verified && showVerificationBanner && (
        <div className="verification-banner">
          <div className="verification-banner-content">
            <FiAlertCircle className="alert-icon" />
            <span>
              Your email is not verified. Please verify your email to access all features.
            </span>
            <div className="verification-banner-actions">
              <a href="/verify" className="verify-link">
                Verify Now
              </a>
              <button
                onClick={handleResendVerification}
                disabled={resendCooldown > 0 || resendLoading}
                className="resend-button"
              >
                {resendLoading ? 'Sending...' : resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code'}
              </button>
              <button onClick={dismissBanner} className="dismiss-button">
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
      <header className="technomatch-header unverified">
        <div className="header-container">
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
                disabled={!userData.email_verified}
                title={userData.email_verified ? "Play now" : "Email verification required to play"}
              >
                {!userData.email_verified ? (
                  <>
                    <span className="verification-lock">
                      <FiMail className="lock-icon" />
                    </span>
                    <span className="play-text">Verify to Play</span>
                  </>
                ) : (
                  <span className="play-text">Play Now</span>
                )}
              </button>
            </div>

            <a href="/leaderboard" className="nav-link">Leaderboard</a>
            <a 
              href={userData.email_verified ? "/store" : "#"} 
              className={`nav-link ${!userData.email_verified ? 'disabled' : ''}`}
              title={!userData.email_verified ? "Email verification required" : "Store"}
            >
              Store
            </a>
          </nav>

          <div className="header-actions">
            {/* Settings */}
            <div className="dropdown-container">
              <button 
                onClick={toggleSettingsMenu}
                className="icon-button settings-button"
                aria-label="Settings"
              >
                <FiSettings className="icon" />
              </button>

              {showSettingsMenu && (
                <div className="dropdown-menu settings-menu">
                  <div className="dropdown-header">
                    <h3>Settings</h3>
                  </div>

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

            {/* Profile */}
            <div className="dropdown-container">
              <button 
                onClick={toggleProfileMenu}
                className="profile-button"
                aria-label="User profile"
              >
                <span className="user-name">{userData.first_name} {userData.last_name}</span>
                <FiChevronDown className="dropdown-icon" />
              </button>

              {showProfileMenu && (
                <div className="dropdown-menu profile-menu">
                  <div className="profile-header">
                    <div className="profile-info">
                      <h3>{userData.first_name} {userData.last_name}</h3>
                      <p className="username">@{userData.username}</p>
                      <div className="verification-status">
                        <FiMail className="verification-icon" />
                        <span>
                          {userData.email_verified ? 'Email verified' : 'Email not verified'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="profile-section">
                    <h4>Account Details</h4>
                    <div className="account-details">
                      <div className="detail-item">
                        <span className="detail-label">Email:</span>
                        <span className="detail-value">{userData.email}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">School:</span>
                        <span className="detail-value">{userData.school || 'Not set'}</span>
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