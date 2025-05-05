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
  const [queuingTime, setQueuingTime] = useState(0);
  const gameModeMenuRef = useRef(null);
  const queuingTimerRef = useRef(null);
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
  
  // Handle click outside to close dropdown
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

  // Format time for display
  const formatQueuingTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  // Toggle game mode menu
  const toggleGameModeMenu = useCallback(() => {
    setShowGameModeMenu(prev => !prev);
  }, []);

  // Cancel queuing
  const cancelQueuing = useCallback(() => {
    if (userStatus === 'queuing') {
      setUserStatus('online');
      updateUserStatus('online');
    }
  }, [userStatus, setUserStatus, updateUserStatus]);

  // Navigate to appropriate page based on game mode
  const navigateToGameMode = (mode) => {
    if (mode === 'progressive') {
      window.location.href = '/progressive';
    } else if (mode === 'blitz') {
      window.location.href = '/blitz';
    } else if (mode === 'ranked') {
      window.location.href = '/ranked';
    }
  };

  const switchGameMode = useCallback((mode) => {
    onGameModeChange(mode);
    setShowGameModeMenu(false);
    
    if (userStatus === 'online') {
      setUserStatus('queuing');
      updateUserStatus('queuing');
      if (mode === 'progressive') {
        setTimeout(() => {
          navigateToGameMode(mode);
        }, 500);
      } else {
        setTimeout(() => {
          setUserStatus('playing');
          updateUserStatus('playing');
          setTimeout(() => {
            setUserStatus('post-match');
            updateUserStatus('post-match');
            setTimeout(() => {
              setUserStatus('online');
              updateUserStatus('online');
            }, 5000);
          }, 10000);
        }, 3000);
      }
    }
  }, [userStatus, onGameModeChange, setUserStatus, updateUserStatus]);

  return (
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