import React, { useState, useEffect } from 'react';
import { 
  Trophy, Medal, Star, ArrowUp, ArrowDown, Search, 
  ChevronLeft, ChevronRight, Filter, Users, Calendar,
  Clock, Crown
} from 'lucide-react';
import '../../../scss/Components/Dashboard/Leaderboards.scss';
const mockUsers = [
  { id: 1, name: 'Alex Johnson', rank: 1, score: 9850, avatar: '/api/placeholder/40/40', change: 'up', level: 42, streak: 28, highestScore: 12000 },
  { id: 2, name: 'Maya Rodriguez', rank: 2, score: 9720, avatar: '/api/placeholder/40/40', change: 'same', level: 40, streak: 35, highestScore: 10500 },
  { id: 3, name: 'James Chen', rank: 3, score: 9510, avatar: '/api/placeholder/40/40', change: 'up', level: 39, streak: 14, highestScore: 11200 },
  { id: 4, name: 'Sarah Kim', rank: 4, score: 9350, avatar: '/api/placeholder/40/40', change: 'down', level: 38, streak: 7, highestScore: 9800 },
  { id: 5, name: 'Tyrone Williams', rank: 5, score: 9210, avatar: '/api/placeholder/40/40', change: 'up', level: 37, streak: 21, highestScore: 9500 },
];

const currentUserRank = { 
  id: 123, 
  name: 'You', 
  rank: 123, 
  score: 4350, 
  avatar: '/api/placeholder/40/40', 
  change: 'up', 
  level: 21,
  streak: 8,
  highestScore: 5100
};

const LeaderDashboard = () => {
  const [filter, setFilter] = useState('global');
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
  const handleTimeFilterChange = (newTimeFilter) => {
    setTimeFilter(newTimeFilter);
    setCurrentPage(1);
  };

  // Render rank badge based on position
  const renderRankBadge = (rank) => {
    if (rank === 1) {
      return <Trophy className="h-6 w-6 text-yellow-500" />;
    } else if (rank === 2) {
      return <Medal className="h-6 w-6 text-gray-400" />;
    } else if (rank === 3) {
      return <Medal className="h-6 w-6 text-amber-700" />;
    } else {
      return <span className="font-semibold text-gray-700 dark:text-gray-300 text-lg">{rank}</span>;
    }
  };

  // Render change indicator
  const renderChangeIndicator = (change) => {
    if (change === 'up') {
      return <ArrowUp className="h-4 w-4 text-green-500" />;
    } else if (change === 'down') {
      return <ArrowDown className="h-4 w-4 text-red-500" />;
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
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden">
          <div className="p-6 sm:p-8">
            {/* Header with animated gradient */}
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-rose-500 to-purple-600 opacity-10 dark:opacity-20 rounded-lg"></div>
              <div className="relative flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-br from-amber-400 to-pink-500 rounded-lg shadow-lg">
                    <Trophy className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                    Leaderboards
                  </h2>
                </div>
                <div className="flex items-center space-x-2">
                  {/* Time filter dropdown */}
                  <div className="relative">
                    <select
                      className="appearance-none bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg pl-3 pr-10 py-2 text-sm font-medium border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500"
                      value={timeFilter}
                      onChange={(e) => handleTimeFilterChange(e.target.value)}
                    >
                      <option value="allTime">All Time</option>
                      <option value="weekly">This Week</option>
                      <option value="monthly">This Month</option>
                      <option value="daily">Today</option>
                    </select>
                    <Clock className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* Filters and Search */}
            <div className="flex flex-col md:flex-row justify-between mb-6 space-y-4 md:space-y-0">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleFilterChange('global')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center ${
                    filter === 'global'
                      ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  <Crown className={`h-4 w-4 mr-1.5 ${filter === 'global' ? 'text-white' : 'text-gray-500 dark:text-gray-400'}`} />
                  Global
                </button>
                <button
                  onClick={() => handleFilterChange('friends')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center ${
                    filter === 'friends'
                      ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  <Users className={`h-4 w-4 mr-1.5 ${filter === 'friends' ? 'text-white' : 'text-gray-500 dark:text-gray-400'}`} />
                  Friends
                </button>
                <button
                  onClick={() => handleFilterChange('server')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center ${
                    filter === 'server'
                      ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  <Filter className={`h-4 w-4 mr-1.5 ${filter === 'server' ? 'text-white' : 'text-gray-500 dark:text-gray-400'}`} />
                  Server
                </button>
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search users..."
                  className="pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 w-full md:w-auto focus:outline-none focus:ring-2 focus:ring-pink-500 dark:focus:ring-pink-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
              </div>
            )}

            {/* Leaderboard Table */}
            {!isLoading && (
              <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Rank</th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">User</th>
                        <th className="py-3 px-4 text-center text-sm font-medium text-gray-500 dark:text-gray-400">Level</th>
                        <th className="py-3 px-4 text-right text-sm font-medium text-gray-500 dark:text-gray-400">Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockUsers.map((user, index) => (
                        <React.Fragment key={user.id}>
                          <tr
                            className={`border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors ${
                              user.id === currentUserRank.id ? 'bg-pink-50 dark:bg-pink-900/10' : ''
                            } ${focusedUser && focusedUser.id === user.id ? 'bg-pink-50 dark:bg-pink-900/20' : ''}`}
                            onClick={() => toggleUserDetails(user)}
                          >
                            <td className="py-4 px-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="w-8 h-8 flex items-center justify-center">
                                  {renderRankBadge(user.rank)}
                                </div>
                                <span className="ml-2">{renderChangeIndicator(user.change)}</span>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center">
                                <div className="relative">
                                  <img
                                    src={user.avatar}
                                    alt={user.name}
                                    className="h-10 w-10 rounded-full object-cover ring-2 ring-white dark:ring-gray-800 shadow"
                                  />
                                  {user.streak > 20 && (
                                    <div className="absolute -bottom-1 -right-1 bg-yellow-500 rounded-full p-0.5 shadow-lg">
                                      <Star className="h-3 w-3 text-white" />
                                    </div>
                                  )}
                                </div>
                                <div className="ml-3">
                                  <span className={`font-medium ${user.id === currentUserRank.id ? 'text-pink-600 dark:text-pink-400' : 'text-gray-800 dark:text-gray-200'}`}>
                                    {user.name}
                                  </span>
                                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                    {user.streak} day streak
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center justify-center">
                                <div className="rounded-full bg-gray-100 dark:bg-gray-800 px-3 py-1">
                                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200">Lvl {user.level}</span>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-4 text-right">
                              <span className="font-bold text-gray-800 dark:text-gray-200">{user.score.toLocaleString()}</span>
                            </td>
                          </tr>
                          
                          {/* Expanded user details */}
                          {showDetails && focusedUser && focusedUser.id === user.id && (
                            <tr className="bg-pink-50/50 dark:bg-pink-900/5">
                              <td colSpan={4} className="p-4">
                                <div className="flex flex-wrap justify-between gap-4">
                                  <div className="flex items-center space-x-6">
                                    <div>
                                      <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Highest Score</div>
                                      <div className="font-bold text-gray-800 dark:text-gray-200">{user.highestScore.toLocaleString()}</div>
                                    </div>
                                    <div>
                                      <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Current Streak</div>
                                      <div className="font-bold text-gray-800 dark:text-gray-200">{user.streak} days</div>
                                    </div>
                                  </div>
                                  <div>
                                    <button className="px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white text-sm font-medium rounded-lg shadow-sm transition-colors">
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

                {/* Pagination */}
                <div className="py-3 px-6 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Page {currentPage} of {totalPages}
                  </span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className={`p-2 rounded-lg ${
                        currentPage === 1 
                          ? 'text-gray-400 cursor-not-allowed' 
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    {[...Array(Math.min(5, totalPages))].map((_, idx) => {
                      const pageNum = idx + 1;
                      return (
                        <button
                          key={idx}
                          onClick={() => handlePageChange(pageNum)}
                          className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm ${
                            currentPage === pageNum
                              ? 'bg-pink-500 text-white'
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    <button
                      onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className={`p-2 rounded-lg ${
                        currentPage === totalPages
                          ? 'text-gray-400 cursor-not-allowed'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Your Position */}
            <div className="mt-8">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Your Position</h3>
              <div className="bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-900/10 dark:to-rose-900/10 border border-pink-100 dark:border-pink-900/20 rounded-xl p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex items-center w-12 justify-center">
                      <span className="font-semibold text-gray-700 dark:text-gray-300">{currentUserRank.rank}</span>
                      <span className="ml-2">{renderChangeIndicator(currentUserRank.change)}</span>
                    </div>
                    <div className="flex items-center ml-2">
                      <div className="relative">
                        <img
                          src={currentUserRank.avatar}
                          alt={currentUserRank.name}
                          className="h-10 w-10 rounded-full object-cover ring-2 ring-white dark:ring-gray-800 shadow"
                        />
                        {currentUserRank.streak > 7 && (
                          <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-0.5 shadow-lg">
                            <Star className="h-3 w-3 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="ml-3">
                        <span className="font-medium text-pink-600 dark:text-pink-400">{currentUserRank.name}</span>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          {currentUserRank.streak} day streak
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6">
                    <div className="hidden sm:block">
                      <div className="text-xs text-gray-500 dark:text-gray-400">Highest Score</div>
                      <div className="font-medium text-gray-800 dark:text-gray-200">{currentUserRank.highestScore.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Level</div>
                      <div className="font-medium text-gray-800 dark:text-gray-200">{currentUserRank.level}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Score</div>
                      <div className="font-bold text-gray-800 dark:text-gray-200">
                        {currentUserRank.score.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Actions */}
            <div className="mt-8 flex justify-end">
              <button className="px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white text-sm font-medium rounded-lg shadow-sm transition-colors">
                View Full Leaderboard
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderDashboard;