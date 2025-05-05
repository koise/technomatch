import React from 'react';
import PlayButton from './PlayButton';

const Navigation = ({ 
  userStatus, 
  setUserStatus, 
  activeMode, 
  onGameModeChange,
  updateUserStatus
}) => {
  return (
    <nav className="nav-links">
      <a href="/dashboard" className="nav-link">Dashboard</a>
      <a href="/classes" className="nav-link">Classes</a>
      
      {/* Game Play Button */}
      <PlayButton 
        userStatus={userStatus}
        setUserStatus={setUserStatus}
        activeMode={activeMode}
        onGameModeChange={onGameModeChange}
        updateUserStatus={updateUserStatus}
      />
      
      <a href="/leaderboard" className="nav-link">Leaderboard</a>
      <a href="/store" className="nav-link">Store</a>
    </nav>
  );
};

export default Navigation;