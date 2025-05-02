import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTheme } from '../../context/ThemeContext';
import axios from 'axios';
import { 
  FiSun, FiMoon, FiSettings, FiUser, FiBell, FiLogOut, FiChevronDown, 
  FiBook, FiTrendingUp, FiAward, FiCode, FiPlay, FiClock, FiCheck, 
  FiZap, FiShoppingBag, FiX, FiAlertCircle, FiGlobe, FiDollarSign 
} from 'react-icons/fi';
import '../../../scss/Components/Partials/HeaderLogged.scss';

const HeaderLogged = () => {
  // Context and state
  const { darkMode, toggleTheme } = useTheme();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [showGameModeMenu, setShowGameModeMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [fontFamily, setFontFamily] = useState('var(--font-sans)');
  const [userStatus, setUserStatus] = useState('online');
  const [queuingTime, setQueuingTime] = useState(0);
  const [activeMode, setActiveMode] = useState('progressive');
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
  
  // Refs
  const queuingTimerRef = useRef(null);
  const profileMenuRef = useRef(null);
  const settingsMenuRef = useRef(null);
  const gameModeMenuRef = useRef(null);
  const notificationsMenuRef = useRef(null);
  
  // Constants
  const fontOptions = [
    { name: "System UI", value: "var(--font-sans)" },
    { name: "Serif", value: "var(--font-serif)" },
    { name: "Monospace", value: "var(--font-mono)" }
  ];

  const gameModes = [
    {
      id: 'progressive',
      name: 'Progressive',
      icon: <FiTrendingUp className="mode-icon" />,
      description: 'Level up by completing challenges'
    },
    {
      id: 'blitz',
      name: 'Blitz Mode',
      icon: <FiZap className="mode-icon" />,
      description: 'Competing with small amount of time'
    },
    {
      id: 'ranked',
      name: 'Ranked',
      icon: <FiAward className="mode-icon" />,
      description: 'Compete against others to climb leaderboards'
    },
    {
      id: 'contest',
      name: 'Contest',
      icon: <FiClock className="mode-icon" />,
      description: 'Scheduled competitive events — coming soon'
    }
  ];

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/fetch-user');
        console.log(response.data.user);
        if (response.data && response.data.user) {
          setUserData(response.data.user);
          
          if (response.data.user.profile) {
            // Set font preference
            if (response.data.user.profile.preferred_font) {
              const fontOption = fontOptions.find(opt => 
                opt.name === response.data.user.profile.preferred_font
              );
              if (fontOption) setFontFamily(fontOption.value);
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
        
        // Fetch notifications
        await fetchNotifications();
        
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

  // Handle queuing timer
  useEffect(() => {
    if (userStatus === 'queuing') {
      queuingTimerRef.current = setInterval(() => {
        setQueuingTime(prevTime => prevTime + 1);
      }, 1000);
    } else {
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

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
      
      if (settingsMenuRef.current && !settingsMenuRef.current.contains(event.target)) {
        setShowSettingsMenu(false);
      }
      
      if (gameModeMenuRef.current && !gameModeMenuRef.current.contains(event.target)) {
        setShowGameModeMenu(false);
      }
      
      if (notificationsMenuRef.current && !notificationsMenuRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Format time for display
  const formatQueuingTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);

    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      // Mock notifications - replace with actual API call
      const mockNotifications = [
        {
          id: 1,
          type: 'challenge',
          title: 'New Challenge Available',
          content: 'Try our new React components challenge!',
          time: '10m ago',
          read: false,
          icon: <FiCode />
        },
        {
          id: 2,
          type: 'rank',
          title: 'Rank Updated',
          content: 'Congratulations! You reached TechnoMatch tier.',
          time: '2h ago',
          read: false,
          icon: <FiAward />
        },
        {
          id: 3,
          type: 'coin',
          title: 'Coins Awarded',
          content: 'You earned 50 coins for completing daily challenge.',
          time: '1d ago',
          read: true,
          icon: <FiDollarSign />
        }
      ];
      
      setNotifications(mockNotifications);
      setHasUnreadNotifications(mockNotifications.some(notif => !notif.read));
      
      // In a real app, use something like:
      // const response = await axios.get('/notifications');
      // setNotifications(response.data.notifications);
      // setHasUnreadNotifications(response.data.hasUnread);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  // Mark notification as read
  const markNotificationAsRead = async (notificationId) => {
    try {
      // Update local state first for immediate feedback
      setNotifications(prevNotifications => 
        prevNotifications.map(notif => 
          notif.id === notificationId 
            ? { ...notif, read: true } 
            : notif
        )
      );
      
      // Check if there are still any unread notifications
      const stillHasUnread = notifications.some(notif => 
        notif.id !== notificationId && !notif.read
      );
      setHasUnreadNotifications(stillHasUnread);
      
      // In a real app, send to server:
      // await axios.post('/mark-notification-read', { notificationId });
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  // Mark all notifications as read
  const markAllNotificationsAsRead = async () => {
    try {
      setNotifications(prevNotifications => 
        prevNotifications.map(notif => ({ ...notif, read: true }))
      );
      setHasUnreadNotifications(false);
      
      // In a real app, send to server:
      // await axios.post('/mark-all-notifications-read');
    } catch (err) {
      console.error("Error marking all notifications as read:", err);
    }
  };

  // Toggle menu functions
  const toggleProfileMenu = useCallback(() => {
    setShowProfileMenu(prev => !prev);
    setShowSettingsMenu(false);
    setShowGameModeMenu(false);
    setShowNotifications(false);
  }, []);

  const toggleSettingsMenu = useCallback(() => {
    setShowSettingsMenu(prev => !prev);
    setShowProfileMenu(false);
    setShowGameModeMenu(false);
    setShowNotifications(false);
  }, []);

  const toggleGameModeMenu = useCallback(() => {
    setShowGameModeMenu(prev => !prev);
    setShowProfileMenu(false);
    setShowSettingsMenu(false);
    setShowNotifications(false);
  }, []);

  const toggleNotificationsMenu = useCallback(() => {
    setShowNotifications(prev => !prev);
    setShowProfileMenu(false);
    setShowSettingsMenu(false);
    setShowGameModeMenu(false);
  }, []);

  // Cancel queuing
  const cancelQueuing = useCallback(() => {
    if (userStatus === 'queuing') {
      setUserStatus('online');
      updateUserStatus('online');
    }
  }, [userStatus]);
  
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

  // Switch game mode
  const switchGameMode = useCallback((mode) => {
    setActiveMode(mode);
    setShowGameModeMenu(false);
    
    // Save the user's game mode preference
    updateUserPreference('game_mode', mode);
    
    // Only trigger game flow if user is online
    if (userStatus === 'online') {
      // Status flow: online -> queuing -> playing -> post-match -> online
      setUserStatus('queuing');
      updateUserStatus('queuing');
      
      // Simulate finding a match after 3 seconds
      setTimeout(() => {
        setUserStatus('playing');
        updateUserStatus('playing');
        
        // Simulate match completion after 10 seconds
        setTimeout(() => {
          setUserStatus('post-match');
          updateUserStatus('post-match');
          
          // Return to online status after 5 seconds
          setTimeout(() => {
            setUserStatus('online');
            updateUserStatus('online');
          }, 5000);
        }, 10000);
      }, 3000);
    }
  }, [userStatus]);

  // Get status icon based on user status
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
      case 'offline':
        return <div className="status-dot offline"></div>;
      case 'online':
      default:
        return <div className="status-dot online"></div>;
    }
  };

  // Get status text based on user status
  const getStatusText = () => {
    switch(userStatus) {
      case 'queuing':
        return `Finding match... (${formatQueuingTime(queuingTime)})`;
      case 'playing':
        return 'In match';
      case 'post-match':
        return 'Match complete';
      case 'offline':
        return 'Offline';
      case 'online':
      default:
        return 'Online';
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
    const fontName = fontOptions.find(opt => opt.value === fontValue)?.name;
    if (fontName) {
      updateUserPreference('preferred_font', fontName);
    }
  }, [fontOptions]);

  // Toggle user status between online and offline
  const toggleOnlineStatus = useCallback(() => {
    const newStatus = userStatus === 'online' ? 'offline' : 'online';
    setUserStatus(newStatus);
    updateUserStatus(newStatus);
  }, [userStatus]);

  // Loading and error states
  if (loading) {
    return (
      <header className="technomatch-header">
        <div className="header-container loading-container">
          <div className="logo-section">
            <div className="logo">
              <span className="logo-primary">Techno</span>
              <span className="logo-secondary">Match</span>
            </div>
          </div>
          <div className="loading-indicator">Loading user profile...</div>
        </div>
      </header>
    );
  }

  if (error) {
    return (
      <header className="technomatch-header">
        <div className="header-container error-container">
          <div className="logo-section">
            <div className="logo">
              <span className="logo-primary">Techno</span>
              <span className="logo-secondary">Match</span>
            </div>
          </div>
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
          <div className="logo-section">
            <div className="logo">
              <span className="logo-primary">Techno</span>
              <span className="logo-secondary">Match</span>
            </div>
          </div>
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
          
          {/* Game Play Button */}
          <div className="game-play-container" ref={gameModeMenuRef}>
            <button 
              className={`play-button ${userStatus !== 'online' ? 'disabled' : ''}`}
              onClick={userStatus === 'queuing' ? cancelQueuing : toggleGameModeMenu}
              disabled={userStatus !== 'online' && userStatus !== 'queuing'}
            >
              {userStatus === 'queuing' ? (
                <div className="queuing-display">
                  <FiClock className="play-icon pulsing" />
                  <span className="queuing-text">({formatQueuingTime(queuingTime)})</span>
                  <FiX className="cancel-icon" />
                </div>
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
                  {gameModes.map(mode => (
                    <button 
                      key={mode.id}
                      className={`game-mode-option ${activeMode === mode.id ? 'active' : ''}`}
                      onClick={() => switchGameMode(mode.id)}
                      disabled={mode.id === 'contest'} // Disable "Coming soon" mode
                    >
                      {mode.icon}
                      <div className="mode-details">
                        <span className="mode-name">{mode.name}</span>
                        <span className="mode-description">{mode.description}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <a href="/leaderboard" className="nav-link">Leaderboard</a>
          <a href="/store" className="nav-link">Store</a>
        </nav>

        <div className="header-actions">
          {/* Progress/Rank Display */}
          <div className="progress-display">
            {activeMode === 'progressive' ? (
              <div className="progress-info progressive-mode">
                <div className="progress-bar-container">
                  <div 
                    className="progress-bar-fill" 
                    style={{ width: `${((userData.progressive?.xp || 0) / (userData.progressive?.nextLevel || 20)) * 100}%` }}
                  ></div>
                </div>
                <div className="progress-details">
                  <span className="progress-level">Level {userData.progressive?.level || 0}</span>
                  <span className="progress-xp">{userData.progressive?.xp || 0}/{userData.progressive?.nextLevel || 20} XP</span>
                </div>
              </div>
            ) : (
              <div className="progress-info ranked-mode">
                <div className="rank-badge">
                  <FiAward className="rank-icon" />
                  <span className="rank-tier">{userData.ranked?.tier || 'Unranked'}</span>
                </div>
                <span className="rank-points">{userData.ranked?.points || 0} pts</span>
              </div>
            )}
          </div>

          {/* Currency Display */}
          <div className="currency-display">
            <FiDollarSign className="currency-icon" />
            <span className="currency-amount">{userData.profile?.currency || 942}</span>
          </div>

          {/* Notifications */}
          <div className="dropdown-container" ref={notificationsMenuRef}>
            <button 
              className="icon-button notification-button"
              onClick={toggleNotificationsMenu}
              aria-label="Notifications"
            >
              <FiBell className="icon" />
              {hasUnreadNotifications && <span className="notification-indicator"></span>}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="dropdown-menu notifications-menu">
                <div className="dropdown-header">
                  <h3>Notifications</h3>
                  {hasUnreadNotifications && (
                    <button 
                      className="mark-all-read-button"
                      onClick={markAllNotificationsAsRead}
                    >
                      Mark all as read
                    </button>
                  )}
                </div>
                
                <div className="notifications-list">
                  {notifications.length > 0 ? (
                    notifications.map(notification => (
                      <div 
                        key={notification.id} 
                        className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                        onClick={() => markNotificationAsRead(notification.id)}
                      >
                        <div className={`notification-icon ${notification.type}`}>
                          {notification.icon}
                        </div>
                        <div className="notification-content">
                          <div className="notification-header">
                            <h4>{notification.title}</h4>
                            <span className="notification-time">{notification.time}</span>
                          </div>
                          <p>{notification.content}</p>
                        </div>
                        {!notification.read && <div className="unread-dot"></div>}
                      </div>
                    ))
                  ) : (
                    <div className="empty-notifications">
                      <p>No notifications yet</p>
                    </div>
                  )}
                </div>
                
                <div className="notifications-footer">
                  <a href="/notifications">View all notifications</a>
                </div>
              </div>
            )}
          </div>

          {/* Settings */}
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

          {/* User Profile */}
          <div className="dropdown-container" ref={profileMenuRef}>
            <button 
              onClick={toggleProfileMenu}
              className="profile-button"
              aria-label="User profile"
            >
              <div className="avatar-container">
                <img 
                  src={userData.profile?.avatar_path || '/avatar/default-7.svg'} 
                  alt="User avatar" 
                  className="avatar" 
                />
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
                    <img 
                      src={userData.profile?.avatar_path || '/avatar/default-7.svg'} 
                      alt="User avatar" 
                      className="large-avatar" 
                    />
                    <div className={`status-indicator large ${userStatus}`}></div>
                  </div>
                  <div className="profile-info">
                    <h3>{userData.name}</h3>
                    <p>{userData.profile?.rank_title || userData.ranked?.tier || 'User'}</p>
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
                        <span className="stat-value">Level {userData.progressive?.level || 0} · {userData.progressive?.completed || 0} completed</span>
                      </div>
                    </div>
                    <div className="stat-item">
                      <FiAward className="stat-icon ranked" />
                      <div className="stat-details">
                        <span className="stat-label">Ranked</span>
                        <span className="stat-value">{userData.ranked?.tier || 'Unranked'} · #{userData.ranked?.position || '-'} · {userData.ranked?.winRate || '0%'} win rate</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* User Account Quick Links */}
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
                  <a href="/store" className="profile-action">
                    <FiShoppingBag className="action-icon" />
                    Store
                  </a>
                  <a href="/language" className="profile-action">
                    <FiGlobe className="action-icon" />
                    Language
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