import React, { useState, useRef, useEffect } from 'react';
import { 
  FiUser, FiSettings, FiBook, FiShoppingBag, FiGlobe, FiLogOut,
  FiTrendingUp, FiAward, FiChevronDown
} from 'react-icons/fi';

const ProfileMenu = ({ userData, userStatus, updateUserStatus }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef(null);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Toggle menu function
  const toggleProfileMenu = () => {
    setShowProfileMenu(prev => !prev);
  };

  // Get status text based on user status
  const getStatusText = () => {
    switch(userStatus) {
      case 'queuing':
        return 'Finding match...';
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

  return (
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
  );
};

export default ProfileMenu;