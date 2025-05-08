import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { FiUserPlus, FiUserCheck, FiX, FiUser, FiUsers, FiUserX, FiSearch, FiLoader, FiUserMinus, FiUserX as FiUserRemove, FiInfo, FiAlertCircle } from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../../../scss/Components/Partials/FriendsSidebar.scss';
import '../../../../scss/Components/Partials/modalAndToast.scss';
import { initAuth, api } from '../../../utils/auth';

// Create a custom event for friend request updates
export const FRIEND_REQUEST_UPDATE_EVENT = 'friendRequestUpdate';

// Helper function to get avatar URL
const getAvatarUrl = (avatarPath) => {
  // If no path provided, use a default avatar
  if (!avatarPath) {
    return '/avatar/default.svg';
  }
  
  // If the path is already correct, return it directly
  if (avatarPath.startsWith('/')) {
    return avatarPath;
  }
  
  // Otherwise add the correct path prefix
  return `/${avatarPath}`;
};

const FriendsSidebar = ({ isOpen, onClose }) => {
  const [friendsList, setFriendsList] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('friends');
  const [loading, setLoading] = useState(true);
  const [actionInProgress, setActionInProgress] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const isFirstRender = useRef(true);

  // Add search-related state
  const [searchCriteria, setSearchCriteria] = useState('all'); // 'all', 'name', 'username', 'email'
  const [noResultsFound, setNoResultsFound] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const searchTimeoutRef = useRef(null);

  // Add state for unfriend confirmation modal
  const [confirmUnfriend, setConfirmUnfriend] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);

  // Fetch friends data with a useCallback to allow calling from other places
  const fetchFriendsData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Check authentication first
      const isAuthenticated = await initAuth();
      if (!isAuthenticated) {
        toast.error('Authentication error. Please log in again.');
        setLoading(false);
        return;
      }
      
      // Use the api client from auth.js instead of direct axios calls
      const friendsResponse = await api.get('/api/friends');
      console.log(friendsResponse.data);
      setFriendsList(friendsResponse.data || []);
      
      const requestsResponse = await api.get('/api/friend-requests');
      setFriendRequests(requestsResponse.data || []);
      
      // Dispatch custom event with friend request count
      const event = new CustomEvent(FRIEND_REQUEST_UPDATE_EVENT, { 
        detail: { count: requestsResponse.data?.length || 0 } 
      });
      window.dispatchEvent(event);
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching friends data:', error);
      setLoading(false);
      
      // Show more specific error messages based on the error
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        const status = error.response.status;
        if (status === 401) {
          toast.error('You need to be logged in to view friends. Please log in again.');
        } else if (status === 403) {
          toast.error('You do not have permission to view friends data.');
        } else if (status === 404) {
          toast.error('Friend API endpoints not found. Please check your server configuration.');
        } else {
          toast.error(`Server error (${status}): ${error.response.data?.message || 'Failed to load friends data'}`);
        }
      } else if (error.request) {
        // The request was made but no response was received
        toast.error('Network error. Please check your connection and try again.');
      } else {
        // Something happened in setting up the request that triggered an Error
        toast.error('Failed to load friends data. Please try refreshing the page.');
      }
    }
  }, []);

  useEffect(() => {
    // Only fetch data when the sidebar opens
    if (isOpen) {
      fetchFriendsData();
      
      // Set up polling every 30 seconds
      const interval = setInterval(() => {
        fetchFriendsData();
      }, 30000);
      
      return () => clearInterval(interval);
    }
  }, [isOpen, fetchFriendsData]);

  const handleAddFriend = async (userId) => {
    try {
      setActionInProgress(userId);
      
      // Use the api client
      await api.post('/api/friend-requests', { user_id: userId });
      
      toast.success('Friend request sent successfully');
      setActionInProgress(null);
      
      // Update search results to reflect the sent request
      setSearchResults(prevResults => 
        prevResults.map(user => 
          user.id === userId ? {...user, requestSent: true, notificationVisible: true} : user
        )
      );
      
      // Hide the notification after 3 seconds
      setTimeout(() => {
        setSearchResults(prevResults => 
          prevResults.map(user => 
            user.id === userId ? {...user, notificationVisible: false} : user
          )
        );
      }, 3000);
    } catch (error) {
      console.error('Error sending friend request:', error);
      toast.error(error.response?.data?.message || 'Failed to send friend request');
      setActionInProgress(null);
    }
  };

  const handleAcceptRequest = async (requestId, username) => {
    try {
      setActionInProgress(requestId);
      
      // Use the api client
      await api.post(`/api/friend-requests/${requestId}/accept`);
      
      toast.success(`You are now friends with ${username}`);
      fetchFriendsData();
      setActionInProgress(null);
    } catch (error) {
      console.error('Error accepting friend request:', error);
      toast.error('Failed to accept friend request');
      setActionInProgress(null);
    }
  };

  const handleRejectRequest = async (requestId) => {
    try {
      setActionInProgress(requestId);
      
      // Use the api client
      await api.post(`/api/friend-requests/${requestId}/reject`);
      
      toast.info('Friend request rejected');
      fetchFriendsData();
      setActionInProgress(null);
    } catch (error) {
      console.error('Error rejecting friend request:', error);
      toast.error('Failed to reject friend request');
      setActionInProgress(null);
    }
  };

  const handleRemoveFriend = async (friendId, friendName) => {
    try {
      setActionInProgress(friendId);
      
      // Log the ID to help with debugging
      console.log('Removing friend with ID:', friendId);
      
      // Use the api client from auth.js instead of direct axios calls
      await api.delete(`/api/friends/${friendId}`);
      
      toast.info(`${friendName} has been removed from your friends`);
      fetchFriendsData();
      setActionInProgress(null);
      // Reset the confirmation state
      setConfirmUnfriend(false);
      setSelectedFriend(null);
    } catch (error) {
      console.error('Error removing friend:', error);
      
      // Enhanced error handling
      let errorMessage = 'Failed to remove friend';
      
      if (error.response) {
        const status = error.response.status;
        if (status === 401) {
          errorMessage = 'Your session has expired. Please log in again.';
        } else if (status === 403) {
          errorMessage = 'You do not have permission to remove this friend.';
        } else if (status === 404) {
          errorMessage = 'This friendship does not exist or was already removed.';
        } else if (status === 500) {
          errorMessage = 'Server error occurred. Please try again later.';
        }
      } else if (error.request) {
        errorMessage = 'Network error. Please check your connection and try again.';
      }
      
      toast.error(errorMessage);
      setActionInProgress(null);
      setConfirmUnfriend(false);
      setSelectedFriend(null);
    }
  };

  const handleViewProfile = (userId) => {
    // Navigate to user profile page
    window.location.href = `/profile/${userId}`;
  };

  const handleSearchUsers = async (query) => {
    if (!query.trim() || query.trim().length < 2) {
      setSearchResults([]);
      setNoResultsFound(false);
      setHasSearched(false);
      setSearchError(null);
      return;
    }
    
    try {
      setSearchLoading(true);
      setHasSearched(true);
      setNoResultsFound(false);
      setSearchError(null);
      
      // Check authentication before searching
      const isAuthenticated = await initAuth();
      if (!isAuthenticated) {
        toast.error('Authentication error. Please log in again.');
        setSearchLoading(false);
        return;
      }
      
      // Log search query for debugging
      console.log('Searching users with query:', query, 'criteria:', searchCriteria);
      
      // Use the api client
      const response = await api.get('/api/users/search', { 
        params: { 
          query,
          criteria: searchCriteria
        }
      });
      
      console.log('Search results:', response.data);
      
      // Fix avatar paths in search results
      const resultsWithFixedAvatars = response.data.map(user => ({
        ...user,
        avatar: getAvatarUrl(user.avatar)
      }));
      
      setSearchResults(resultsWithFixedAvatars || []);
      setNoResultsFound(resultsWithFixedAvatars.length === 0);
      setSearchLoading(false);
    } catch (error) {
      console.error('Error searching users:', error);
      
      // Enhanced error handling
      let errorMessage = 'Failed to search users. Please try again later.';
      
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        if (error.response.status === 401) {
          errorMessage = 'Your session has expired. Please log in again.';
        } else if (error.response.status === 429) {
          errorMessage = 'Too many search requests. Please wait a moment and try again.';
        } else if (error.response.status === 500) {
          errorMessage = error.response.data?.message || 'Server error while searching. Please try a different search term.';
        }
      } else if (error.request) {
        // The request was made but no response was received
        errorMessage = 'Network error. Please check your connection and try again.';
      } else if (!navigator.onLine) {
        errorMessage = 'You appear to be offline. Please check your connection.';
      }
      
      toast.error(errorMessage);
      setSearchLoading(false);
      setNoResultsFound(true);
      setSearchError(errorMessage);
      
      // Clear search results on error
      setSearchResults([]);
    }
  };

  // Update the search effect with debouncing
  useEffect(() => {
    if (activeTab === 'add') {
      // Clear any existing timeout
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      
      // Only search if query is at least 2 characters
      if (searchQuery.trim().length >= 2) {
        searchTimeoutRef.current = setTimeout(() => {
          handleSearchUsers(searchQuery);
        }, 500);
      } else {
        // Clear results if query is too short
        setSearchResults([]);
        setNoResultsFound(false);
        setHasSearched(false);
      }
      
      return () => {
        if (searchTimeoutRef.current) {
          clearTimeout(searchTimeoutRef.current);
        }
      };
    }
  }, [searchQuery, activeTab, searchCriteria]);

  // Modify this useEffect to check the ref but not create it
  useEffect(() => {
    // Use the ref from the component's top level
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    
    // Only fetch when changing to friends or requests tab when sidebar is already open
    if (isOpen && (activeTab === 'friends' || activeTab === 'requests')) {
      fetchFriendsData();
    }
  }, [activeTab, isOpen, fetchFriendsData]);

  // Use real data only
  const filteredFriends = friendsList.filter(friend => 
    friend.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    friend.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Add function to open confirmation dialog
  const promptUnfriend = (friend) => {
    setSelectedFriend(friend);
    setConfirmUnfriend(true);
  };

  // Add function to cancel unfriend
  const cancelUnfriend = () => {
    setSelectedFriend(null);
    setConfirmUnfriend(false);
  };

  return (
    <>
      <div className={`friends-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="friends-sidebar-header">
          <h3>Friends</h3>
          <button className="close-btn" onClick={onClose} aria-label="Close">
            <FiX />
          </button>
        </div>

        <div className="friends-search">
          <div className="search-wrapper">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder={
                activeTab === 'add'
                  ? "Enter at least 2 characters to search users..."
                  : "Search your friends..."
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label={activeTab === 'add' ? "Search users" : "Search friends"}
            />
            {searchQuery && (
              <button 
                className="clear-search" 
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
              >
                <FiX />
              </button>
            )}
          </div>
          {activeTab === 'add' && searchQuery.trim().length === 1 && (
            <div className="search-hint">Type at least 2 characters to search</div>
          )}
        </div>

        <div className="friends-tabs">
          <button 
            className={`tab-btn ${activeTab === 'friends' ? 'active' : ''}`}
            onClick={() => setActiveTab('friends')}
            aria-selected={activeTab === 'friends'}
          >
            <FiUsers /> Friends
          </button>
          <button 
            className={`tab-btn ${activeTab === 'requests' ? 'active' : ''}`}
            onClick={() => setActiveTab('requests')}
            aria-selected={activeTab === 'requests'}
          >
            <FiUserPlus /> Requests {friendRequests.length > 0 && <span className="badge">{friendRequests.length}</span>}
          </button>
          <button 
            className={`tab-btn ${activeTab === 'add' ? 'active' : ''}`}
            onClick={() => setActiveTab('add')}
            aria-selected={activeTab === 'add'}
          >
            <FiUserPlus /> Add Friend
          </button>
        </div>

        <div className="friends-content">
          {loading && activeTab !== 'add' ? (
            <div className="loading-state">
              <FiLoader className="spin-animation" />
              <span>Loading friends...</span>
            </div>
          ) : (
            <>
              {activeTab === 'friends' && (
                <div className="friends-list">
                  {filteredFriends.length > 0 ? (
                    filteredFriends.map(friend => (
                      <div key={friend.id} className="friend-item">
                        <div className="friend-avatar">
                          <img src={getAvatarUrl(friend.avatar)} alt={friend.username} />
                          <span className={`status-indicator ${friend.status || 'offline'}`} title={friend.status ? `${friend.status}` : 'offline'}></span>
                        </div>
                        <div className="friend-info">
                          <h4>{friend.name}</h4>
                          <p>@{friend.username}</p>
                        </div>
                        <div className="friend-actions">
                          <button 
                            className="action-btn view-profile"
                            onClick={() => handleViewProfile(friend.id)}
                            title="View Profile"
                            disabled={actionInProgress === friend.id}
                          >
                            <FiUser />
                          </button>
                          <button 
                            className="action-btn remove-friend"
                            onClick={() => promptUnfriend({id: friend.friend_id, name: friend.name})}
                            title="Remove Friend"
                            disabled={actionInProgress === friend.id}
                          >
                            {actionInProgress === friend.id ? <FiLoader className="spin-animation" /> : <FiUserRemove />}
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="empty-state">
                      <FiUsers />
                      {searchQuery ? (
                        <span>No friends match your search</span>
                      ) : (
                        <div className="empty-message">
                          <span>No friends yet</span>
                          <p className="empty-suggestion">Use the "Add Friend" tab to find people</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'requests' && (
                <div className="friend-requests">
                  {friendRequests.length > 0 ? (
                    friendRequests.map(request => (
                      <div key={request.id} className="request-item">
                        <div className="friend-avatar">
                          <img src={getAvatarUrl(request.user.avatar)} alt={request.user.username} />
                        </div>
                        <div className="friend-info">
                          <h4>{request.user.name}</h4>
                          <p>@{request.user.username}</p>
                        </div>
                        <div className="request-actions">
                          <button 
                            className="action-btn accept"
                            onClick={() => handleAcceptRequest(request.id, request.user.username)}
                            title="Accept Request"
                            disabled={actionInProgress === request.id}
                          >
                            {actionInProgress === request.id ? <FiLoader className="spin-animation" /> : <FiUserCheck />}
                          </button>
                          <button 
                            className="action-btn reject"
                            onClick={() => handleRejectRequest(request.id)}
                            title="Reject Request"
                            disabled={actionInProgress === request.id}
                          >
                            <FiX />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="empty-state">
                      <FiInfo />
                      <div className="empty-message">
                        <span>No pending friend requests</span>
                        <p className="empty-suggestion">When someone sends you a request, it will appear here</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'add' && (
                <div className="add-friends">
                  <div className="search-options">
                    <div className="search-filters">
                      <span className="filter-label">Search by:</span>
                      <div className="filter-options">
                        <button 
                          className={`filter-option ${searchCriteria === 'all' ? 'active' : ''}`}
                          onClick={() => setSearchCriteria('all')}
                        >
                          All
                        </button>
                        <button 
                          className={`filter-option ${searchCriteria === 'name' ? 'active' : ''}`}
                          onClick={() => setSearchCriteria('name')}
                        >
                          Name
                        </button>
                        <button 
                          className={`filter-option ${searchCriteria === 'username' ? 'active' : ''}`}
                          onClick={() => setSearchCriteria('username')}
                        >
                          Username
                        </button>
                        <button 
                          className={`filter-option ${searchCriteria === 'email' ? 'active' : ''}`}
                          onClick={() => setSearchCriteria('email')}
                        >
                          Email
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {searchLoading ? (
                    <div className="loading-state">
                      <FiLoader className="spin-animation" />
                      <span>Searching users...</span>
                    </div>
                  ) : (
                    <>
                      {!searchQuery.trim() ? (
                        <div className="empty-state">
                          <FiSearch />
                          <div className="empty-message">
                            <span>Search for users to add as friends</span>
                            <p className="empty-suggestion">Search by name, username, or email</p>
                          </div>
                        </div>
                      ) : searchError ? (
                        <div className="error-state">
                          <FiX className="error-icon" />
                          <div className="error-message">
                            <span>{searchError}</span>
                            <p className="error-suggestion">Try a different search term or try again later</p>
                            <button 
                              className="retry-button"
                              onClick={() => handleSearchUsers(searchQuery)}
                            >
                              Retry Search
                            </button>
                          </div>
                        </div>
                      ) : searchResults.length > 0 ? (
                        <div className="search-results-container">
                          <div className="results-count">
                            <span>Found {searchResults.length} user{searchResults.length !== 1 ? 's' : ''} with profiles</span>
                          </div>
                          {searchResults.map(user => (
                            <div key={user.id} className="user-item">
                              <div className="friend-avatar">
                                <img src={getAvatarUrl(user.avatar)} alt={user.username} />
                              </div>
                              <div className="friend-info">
                                <h4>{user.name}</h4>
                                <p>@{user.username}</p>
                                <small>{user.email}</small>
                              </div>
                              <div className="friend-actions">
                                {user.isFriend ? (
                                  <span className="status-badge already-friend">Already Friends</span>
                                ) : user.requestSent ? (
                                  <div className="request-status">
                                    <span className="status-badge request-sent">Request Sent</span>
                                    {user.notificationVisible && (
                                      <div className="request-notification">
                                        Friend Request Sent
                                      </div>
                                    )}
                                  </div>
                                ) : (
                                  <button 
                                    className="action-btn add-friend"
                                    onClick={() => handleAddFriend(user.id)}
                                    title="Send Friend Request"
                                    disabled={actionInProgress === user.id}
                                  >
                                    {actionInProgress === user.id ? <FiLoader className="spin-animation" /> : <FiUserPlus />}
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : hasSearched && noResultsFound ? (
                        <div className="empty-state">
                          <FiInfo />
                          <div className="empty-message">
                            <span>No users with profiles found matching "{searchQuery}"</span>
                            <p className="empty-suggestion">Only users who have completed their profile setup will appear in results</p>
                          </div>
                        </div>
                      ) : searchQuery.trim().length === 1 ? (
                        <div className="search-hint">
                          <FiInfo className="hint-icon" />
                          <span>Type at least 2 characters to search</span>
                        </div>
                      ) : (
                        <div className="empty-state">
                          <FiSearch />
                          <span>Enter a search term to find users</span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </>
          )}
        </div>
        
        {/* Add navigation footer */}
        <div className="friends-sidebar-footer">
          <div className="footer-links">
            <a href="/friends" className="footer-link">
              <FiUsers className="footer-icon" />
              <span>View All Friends</span>
            </a>
            {friendRequests.length > 0 && (
              <a href="/friends/requests" className="footer-link highlight">
                <FiUserPlus className="footer-icon" />
                <span>View All Requests</span>
                <span className="badge">{friendRequests.length}</span>
              </a>
            )}
          </div>
        </div>
      </div>
      
      {/* Add the confirmation modal at the end of the component, before the ToastContainer */}
      {confirmUnfriend && selectedFriend && (
        <div className="confirm-dialog">
          <div className="dialog-box">
            <h3>Remove Friend</h3>
            <p>Are you sure you want to remove <strong>{selectedFriend.name}</strong> from your friends?</p>
            <p className="dialog-note">They won't be notified, but you'll need to send a new friend request if you want to be friends again.</p>
            
            <div className="dialog-actions">
              <button 
                className="btn-secondary" 
                onClick={cancelUnfriend}
                disabled={actionInProgress === selectedFriend.id}
              >
                Cancel
              </button>
              <button 
                className="btn-primary" 
                onClick={() => handleRemoveFriend(selectedFriend.id, selectedFriend.name)}
                disabled={actionInProgress === selectedFriend.id}
              >
                {actionInProgress === selectedFriend.id ? (
                  <>
                    <FiLoader className="spin-animation" style={{ marginRight: '8px' }} />
                    Removing...
                  </>
                ) : (
                  <>
                    <FiUserX style={{ marginRight: '8px' }} />
                    Remove
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        className="friends-toast-container"
      />
    </>
  );
};

// Export a function to check the friend request count
export const getFriendRequestCount = async () => {
  try {
    // Check authentication first
    const isAuthenticated = await initAuth();
    if (!isAuthenticated) {
      console.error('Authentication error when getting friend request count');
      return 0;
    }
    
    // Use the api client
    const response = await api.get('/api/friend-requests/count');
    return response.data?.count || 0;
  } catch (error) {
    console.error('Error fetching friend request count:', error);
    return 0;
  }
};

export default FriendsSidebar; 