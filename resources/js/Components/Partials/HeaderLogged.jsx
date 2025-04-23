import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { FiSun, FiMoon, FiSettings, FiUser, FiBell, FiLogOut, FiChevronDown, FiBook, FiTrendingUp, FiAward, FiCode, FiPlay, FiClock, FiCheck, FiZap, FiShoppingBag, FiX } from 'react-icons/fi';
import '../../../scss/Components/Partials/HeaderLogged.scss';

const HeaderLogged = ({ user }) => {
  const { darkMode, toggleTheme } = useTheme();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [fontFamily, setFontFamily] = useState('var(--font-sans)');
  const [showGameModeMenu, setShowGameModeMenu] = useState(false);
  const [userStatus, setUserStatus] = useState('online'); // Default is online
  const [queuingTime, setQueuingTime] = useState(0); // Time in seconds
  const queuingTimerRef = useRef(null);
  
  const [activeMode, setActiveMode] = useState('progressive'); 
  const userData = user || {
    name: "Bart Jason Edades",
    avatar: '/avatar/default-7.svg',
    progress: 75,
    rank: "Techno Crat",
    level: 42,
    progressive: {
      level: 8,
      xp: 750,
      nextLevel: 1000,
      completed: 24
    },
    ranked: {
      tier: "Techno Crat",
      points: 1250,
      position: 342,
      winRate: "68%"
    }
  };

  // List of available fonts
  const fontOptions = [
    { name: "System UI", value: "var(--font-sans)" },
    { name: "Serif", value: "var(--font-serif)" },
    { name: "Monospace", value: "var(--font-mono)" }
  ];

  useEffect(() => {
    // Apply font to document when it changes
    document.documentElement.style.setProperty('--applied-font', fontFamily);
  }, [fontFamily]);

  // Handle queuing timer
  useEffect(() => {
    if (userStatus === 'queuing') {
      // Start the timer
      queuingTimerRef.current = setInterval(() => {
        setQueuingTime(prevTime => prevTime + 1);
      }, 1000);
    } else {
      // Clear the timer when not queuing
      if (queuingTimerRef.current) {
        clearInterval(queuingTimerRef.current);
        queuingTimerRef.current = null;
        setQueuingTime(0);
      }
    }
    
    // Cleanup on unmount
    return () => {
      if (queuingTimerRef.current) {
        clearInterval(queuingTimerRef.current);
      }
    };
  }, [userStatus]);

  const formatQueuingTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
    if (showSettingsMenu) setShowSettingsMenu(false);
    if (showGameModeMenu) setShowGameModeMenu(false);
  };

  const toggleSettingsMenu = () => {
    setShowSettingsMenu(!showSettingsMenu);
    if (showProfileMenu) setShowProfileMenu(false);
    if (showGameModeMenu) setShowGameModeMenu(false);
  };

  const toggleGameModeMenu = () => {
    setShowGameModeMenu(!showGameModeMenu);
    if (showProfileMenu) setShowProfileMenu(false);
    if (showSettingsMenu) setShowSettingsMenu(false);
  };

  const cancelQueuing = () => {
    if (userStatus === 'queuing') {
      setUserStatus('online');
      // Timer will be cleared by the useEffect
    }
  };

  const switchGameMode = (mode) => {
    setActiveMode(mode);
    setShowGameModeMenu(false);
    
    // Simulate queuing and match process
    if (userStatus === 'online') {
      setUserStatus('queuing');
      
      // Simulate finding a match after 3 seconds
      setTimeout(() => {
        setUserStatus('playing');
        
        // Simulate match completion after 10 seconds
        setTimeout(() => {
          setUserStatus('post-match');
          
          // Return to online status after 5 seconds
          setTimeout(() => {
            setUserStatus('online');
          }, 5000);
        }, 10000);
      }, 3000);
    }
  };

  const getStatusIcon = () => {
    switch(userStatus) {
      case 'queuing':
        return (
          <div className="queuing-status">
            <FiClock className="status-icon queuing" />
            <span className="queuing-time">{formatQueuingTime(queuingTime)}</span>
            <button className="cancel-queue-button" onClick={(e) => {
              e.stopPropagation();
              cancelQueuing();
            }}>
              <FiX className="cancel-icon" />
            </button>
          </div>
        );
      case 'playing':
        return <FiPlay className="status-icon playing" />;
      case 'post-match':
        return <FiCheck className="status-icon post-match" />;
      case 'online':
      default:
        return <div className="status-dot online"></div>;
    }
  };

  const getStatusText = () => {
    switch(userStatus) {
      case 'queuing':
        return `Finding match... (${formatQueuingTime(queuingTime)})`;
      case 'playing':
        return 'In match';
      case 'post-match':
        return 'Match complete';
      case 'online':
      default:
        return 'Online';
    }
  };

  return (
    <header className="technomatch-header">
      <div className="header-container">
        {/* Logo */}
        <div className="logo-section">
          <a href="/dashboard" className="logo">
            <span className="logo-primary">Techno</span>
            <span className="logo-secondary">Match</span>
          </a>
        </div>

        {/* Navigation with Play Button in the middle */}
        <nav className="nav-links">
          <a href="/dashboard" className="nav-link">Dashboard</a>
          <a href="/classes" className="nav-link">Classes</a>
          
          {/* Game Play Button moved inside nav */}
          <div className="game-play-container">
            <button 
              className={`play-button ${userStatus !== 'online' ? 'disabled' : ''}`}
              onClick={userStatus === 'queuing' ? cancelQueuing : toggleGameModeMenu}
              disabled={userStatus !== 'online' && userStatus !== 'queuing'}
            >
              {userStatus === 'queuing' ? (
                <>
                  <div className="queuing-display">
                    <FiClock className="play-icon pulsing" />
                    <span className="queuing-text">({formatQueuingTime(queuingTime)})</span>
                    <FiX className="cancel-icon" />
                  </div>
                </>
              ) : (
                <>
                  <FiPlay className="play-icon" />
                  <span className="play-text">Play</span>
                  <FiChevronDown className="dropdown-icon" />
                </>
              )}
            </button>

            {/* Game Mode Menu */}
            {showGameModeMenu && (
              <div className="dropdown-menu game-mode-menu">
                <div className="dropdown-header">
                  <h3>Select Game Mode</h3>
                </div>
                
                <div className="game-modes">
                  <button 
                    className={`game-mode-option ${activeMode === 'progressive' ? 'active' : ''}`}
                    onClick={() => switchGameMode('progressive')}
                  >
                    <FiTrendingUp className="mode-icon" />
                    <div className="mode-details">
                      <span className="mode-name">Progressive</span>
                      <span className="mode-description">Level up by completing challenges</span>
                    </div>
                  </button>

                  <button 
                    className={`game-mode-option ${activeMode === 'blitz' ? 'active' : ''}`}
                    onClick={() => switchGameMode('blitz')}
                  >
                    <FiZap className="mode-icon" />
                    <div className="mode-details">
                      <span className="mode-name">Blitz Mode</span>
                      <span className="mode-description">Competing with small amout of time</span>
                    </div>
                  </button>

                  <button 
                    className={`game-mode-option ${activeMode === 'ranked' ? 'active' : ''}`}
                    onClick={() => switchGameMode('ranked')}
                  >
                    <FiAward className="mode-icon" />
                    <div className="mode-details">
                      <span className="mode-name">Ranked</span>
                      <span className="mode-description">Compete against others to climb leaderboards</span>
                    </div>
                  </button>

                  <button 
                    className={`game-mode-option ${activeMode === 'contest' ? 'active' : ''}`} 
                    onClick={() => switchGameMode('contest')}
                  >
                    <FiClock className="mode-icon" />
                    <div className="mode-details">
                      <span className="mode-name">Contest</span>
                      <span className="mode-description">Scheduled competitive events — coming soon</span>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
          <a href="/leaderboard" className="nav-link">Leaderboard</a>
          <a href="/store" className="nav-link">Store</a>
        </nav>

        <div className="header-actions">
          <div className="progress-display">
            {activeMode === 'progressive' ? (
              <div className="progress-info progressive-mode">
                <div className="progress-bar-container">
                  <div 
                    className="progress-bar-fill" 
                    style={{ width: `${(userData.progressive.xp / userData.progressive.nextLevel) * 100}%` }}
                  ></div>
                </div>
                <div className="progress-details">
                  <span className="progress-level">Level {userData.progressive.level}</span>
                  <span className="progress-xp">{userData.progressive.xp}/{userData.progressive.nextLevel} XP</span>
                </div>
              </div>
            ) : (
              <div className="progress-info ranked-mode">
                <div className="rank-badge">
                  <FiAward className="rank-icon" />
                  <span className="rank-tier">{userData.ranked.tier}</span>
                </div>
                <span className="rank-points">{userData.ranked.points} pts</span>
              </div>
            )}
          </div>

          {/* Notifications */}
          <button className="icon-button notification-button">
            <FiBell className="icon" />
            <span className="notification-indicator"></span>
          </button>

          {/* Settings */}
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
                
                {/* Font Section 
                <div className="settings-section">
                  <h4>Font</h4>
                  <div className="font-options">
                    {fontOptions.map(font => (
                      <button
                        key={font.name}
                        onClick={() => setFontFamily(font.value)}
                        className={`font-option ${fontFamily === font.value ? 'active' : ''}`}
                      >
                        {font.name}
                      </button>
                    ))}
                  </div>
                </div>
                */}
                
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
                <div className={`status-indicator ${userStatus}`}></div>
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
                    <div className={`status-indicator large ${userStatus}`}></div>
                  </div>
                  <div className="profile-info">
                    <h3>{userData.name}</h3>
                    <p>{userData.rank}</p>
                    <span className="user-status-text">{getStatusText()}</span>
                  </div>
                </div>
                
                {/* Game Stats */}
                <div className="profile-section">
                  <h4>Game Stats</h4>
                  <div className="game-stats">
                    <div className="stat-item">
                      <FiTrendingUp className="stat-icon progressive" />
                      <div className="stat-details">
                        <span className="stat-label">Progressive</span>
                        <span className="stat-value">Level {userData.progressive.level} · {userData.progressive.completed} completed</span>
                      </div>
                    </div>
                    <div className="stat-item">
                      <FiAward className="stat-icon ranked" />
                      <div className="stat-details">
                        <span className="stat-label">Ranked</span>
                        <span className="stat-value">{userData.ranked.tier} · #{userData.ranked.position} · {userData.ranked.winRate} win rate</span>
                      </div>
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
                  <a href="/my-classes" className="profile-action">
                    <FiBook className="action-icon" />
                    My Classes
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
  );
};

export default HeaderLogged;