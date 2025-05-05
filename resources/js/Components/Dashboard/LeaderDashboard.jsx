import React, { useState, useEffect } from 'react';
import { 
  Trophy, Medal, Star, ArrowUp, ArrowDown, Search, 
  ChevronLeft, ChevronRight, Filter, Users, Calendar,
  Clock, Crown
} from 'lucide-react';
import '../../../scss/Components/Dashboard/Leaderboards.scss';

const mockUsers = [
  { id: 1, name: 'Alex Johnson', rank: 1, score: 9850, avatar: '/avatar/default-3.svg', change: 'up', level: 42, streak: 28, highestScore: 12000 },
  { id: 2, name: 'Maya Rodriguez', rank: 2, score: 9720, avatar: '/avatar/default-5.svg', change: 'same', level: 40, streak: 35, highestScore: 10500 },
  { id: 3, name: 'James Chen', rank: 3, score: 9510, avatar: '/avatar/default-12.svg', change: 'up', level: 39, streak: 14, highestScore: 11200 },
];

const currentUserRank = { 
  id: 123, 
  name: 'You', 
  rank: 123, 
  score: 4350, 
  avatar: '/avatar/default-12.svg', 
  change: 'up', 
  level: 21,
  streak: 8,
  highestScore: 5100
};

const LeaderDashboard = () => {
  const [filter, setFilter] = useState('Progressive');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [timeFilter, setTimeFilter] = useState('allTime');
  const [showDetails, setShowDetails] = useState(false);
  const [focusedUser, setFocusedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const itemsPerPage = 5;
  const totalPages = 10; // Mock total pages

  useEffect(() => {
    // Simulate loading when filter changes
    if (filter || timeFilter) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [filter, timeFilter]);

  // Filter change handler
  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setCurrentPage(1);
  };
  
  // Time filter change handler
  const handleTimeFilterChange = (e) => {
    setTimeFilter(e.target.value);
    setCurrentPage(1);
  };

  // Render rank badge based on position
  const renderRankBadge = (rank) => {
    if (rank === 1) {
      return <Trophy className="trophy-icon" size={20} />;
    } else if (rank === 2) {
      return <Medal className="silver-medal" size={20} />;
    } else if (rank === 3) {
      return <Medal className="bronze-medal" size={20} />;
    } else {
      return <span className="rank-number">{rank}</span>;
    }
  };

  // Render change indicator
  const renderChangeIndicator = (change) => {
    if (change === 'up') {
      return <ArrowUp className="change-up" size={16} />;
    } else if (change === 'down') {
      return <ArrowDown className="change-down" size={16} />;
    }
    return null;
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };
  
  // Toggle user details
  const toggleUserDetails = (user) => {
    if (focusedUser && focusedUser.id === user.id) {
      setFocusedUser(null);
      setShowDetails(false);
    } else {
      setFocusedUser(user);
      setShowDetails(true);
    }
  };

  return (
    <div className="leaderboard-container">
      <div className="leaderboard-card">
        <div className="leaderboard-content">
          {/* Header with animated gradient */}
          <div className="leaderboard-header">
            <div className="header-content">
              <div className="header-title">
                <div className="header-icon">
                  <Trophy size={18} />
                </div>
                <h2>Leaderboards</h2>
              </div>
              <div className="header-controls">
                {/* Time filter dropdown */}
                <div className="time-filter">
                  <select
                    value={timeFilter}
                    onChange={handleTimeFilterChange}
                  >
                    <option value="allTime">All Time</option>
                    <option value="weekly">This Week</option>
                    <option value="monthly">This Month</option>
                    <option value="daily">Today</option>
                  </select>
                  <Clock className="select-icon" size={16} />
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="filter-section">
            <div className="filter-buttons">
              <button
                onClick={() => handleFilterChange('Progressive')}
                className={`filter-btn ${filter === 'Progressive' ? 'active' : ''}`}
              >
                <Crown size={16} />
                Progressive
              </button>
              <button
                onClick={() => handleFilterChange('Blitz')}
                className={`filter-btn ${filter === 'Blitz' ? 'active' : ''}`}
              >
                <Users size={16} />
                Blitz
              </button>
              <button
                onClick={() => handleFilterChange('Ranked')}
                className={`filter-btn ${filter === 'Ranked' ? 'active' : ''}`}
              >
                <Filter size={16} />
                Ranked
              </button>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="loading-state">
              <div className="spinner"></div>
            </div>
          )}

          {/* Leaderboard Table */}
          {!isLoading && (
            <div className="leaderboard-table">
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Rank</th>
                      <th>User</th>
                      <th className="center-align">Level</th>
                      <th className="right-align">Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockUsers.map((user) => (
                      <React.Fragment key={user.id}>
                        <tr
                          className={`user-row ${user.id === currentUserRank.id ? 'current-user' : ''} 
                            ${focusedUser && focusedUser.id === user.id ? 'selected-user' : ''}`}
                          onClick={() => toggleUserDetails(user)}
                        >
                          <td>
                            <div className="rank-cell">
                              <div className="rank-badge">
                                {renderRankBadge(user.rank)}
                              </div>
                              <span className="change-indicator">{renderChangeIndicator(user.change)}</span>
                            </div>
                          </td>
                          <td>
                            <div className="user-info">
                              <div className="avatar-container">
                                <img
                                  src={user.avatar}
                                  alt={user.name}
                                  className="user-avatar"
                                />
                                {user.streak > 20 && (
                                  <div className="streak-badge">
                                    <Star size={12} />
                                  </div>
                                )}
                              </div>
                              <div className="user-details">
                                <span className={`user-name ${user.id === currentUserRank.id ? 'current-user-name' : ''}`}>
                                  {user.name}
                                </span>
                                <div className="streak-info">
                                  {user.streak} day streak
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="center-align">
                            <div className="level-badge">
                              Lvl {user.level}
                            </div>
                          </td>
                          <td className="right-align">
                            <span className="score-value">{user.score.toLocaleString()}</span>
                          </td>
                        </tr>
                        
                        {/* Expanded user details */}
                        {showDetails && focusedUser && focusedUser.id === user.id && (
                          <tr className="user-details-row">
                            <td colSpan={4}>
                              <div className="details-content">
                                <div className="details-stats">
                                  <div className="stat-item">
                                    <div className="stat-label">Highest Score</div>
                                    <div className="stat-value">{user.highestScore.toLocaleString()}</div>
                                  </div>
                                  <div className="stat-item">
                                    <div className="stat-label">Current Streak</div>
                                    <div className="stat-value">{user.streak} days</div>
                                  </div>
                                </div>
                                <div className="details-actions">
                                  <button className="profile-btn">
                                    View Profile
                                  </button>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Your Position */}
          <div className="your-position-section">
            <h3 className="section-title">Your Position</h3>
            <div className="your-position-card">
              <div className="your-position-content">
                <div className="user-rank">
                  <div className="rank-display">
                    <span className="rank-number">{currentUserRank.rank}</span>
                    <span className="change-indicator">{renderChangeIndicator(currentUserRank.change)}</span>
                  </div>
                  <div className="user-info">
                    <div className="avatar-container">
                      <img
                        src={currentUserRank.avatar}
                        alt={currentUserRank.name}
                        className="user-avatar"
                      />
                      {currentUserRank.streak > 7 && (
                        <div className="streak-badge blue">
                          <Star size={12} />
                        </div>
                      )}
                    </div>
                    <div className="user-details">
                      <span className="user-name current-user-name">{currentUserRank.name}</span>
                      <div className="streak-info">
                        {currentUserRank.streak} day streak
                      </div>
                    </div>
                  </div>
                </div>
                <div className="user-stats">
                  <div className="stat-item highest-score">
                    <div className="stat-label">Highest Score</div>
                    <div className="stat-value">{currentUserRank.highestScore.toLocaleString()}</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-label">Level</div>
                    <div className="stat-value">{currentUserRank.level}</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-label">Score</div>
                    <div className="stat-value">{currentUserRank.score.toLocaleString()}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Actions */}
          <div className="action-section">
            <button className="full-leaderboard-btn">
              View Full Leaderboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderDashboard;