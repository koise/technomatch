import React from 'react';
import { FiAward } from 'react-icons/fi';

const ProgressDisplay = ({ userData, activeMode }) => {
  if (activeMode === 'progressive') {
    return (
      <div className="progress-display">
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
      </div>
    );
  } else {
    return (
      <div className="progress-display">
        <div className="progress-info ranked-mode">
          <div className="rank-badge">
            <FiAward className="rank-icon" />
            <span className="rank-tier">{userData.ranked?.tier || 'Unranked'}</span>
          </div>
          <span className="rank-points">{userData.ranked?.points || 0} pts</span>
        </div>
      </div>
    );
  }
};

export default ProgressDisplay;