import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FiPlay, FiChevronDown, FiClock, FiX, FiTrendingUp, FiZap, FiAward } from 'react-icons/fi';

const PlayButton = ({ 
  userStatus, 
  setUserStatus, 
  activeMode,
  onGameModeChange,
  updateUserStatus
}) => {
  const [showGameModeMenu, setShowGameModeMenu] = useState(false);
  const gameModeMenuRef = useRef(null);

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (gameModeMenuRef.current && !gameModeMenuRef.current.contains(event.target)) {
        setShowGameModeMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleGameModeMenu = useCallback(() => {
    setShowGameModeMenu(prev => !prev);
  }, []);

  const navigateToGameMode = (mode) => {
    if (mode === 'progressive') {
      window.location.href = '/progressive';
    } else if (mode === 'blitz') {
      window.location.href = '/blitz-lobby';
    } else if (mode === 'ranked') {
      window.location.href = '/ranked-lobby';
    }
  };

  const handleGameModeClick = useCallback((mode) => {
    onGameModeChange(mode);
    setShowGameModeMenu(false);
    navigateToGameMode(mode);
  }, [onGameModeChange]);

  return (
    <div className="game-play-container" ref={gameModeMenuRef}>
      <button 
        className={`play-button ${userStatus !== 'online' ? 'disabled' : ''}`}
        onClick={toggleGameModeMenu}
        disabled={userStatus !== 'online'}
      >
        <FiPlay className="play-icon" />
        <span className="play-text">Play</span>
        <FiChevronDown className="dropdown-icon" />
      </button>

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
                onClick={() => handleGameModeClick(mode.id)}
                disabled={mode.id === 'contest'} 
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
  );
};

export default PlayButton;
