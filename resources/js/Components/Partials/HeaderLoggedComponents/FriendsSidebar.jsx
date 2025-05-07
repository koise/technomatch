import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { FiUserPlus, FiUserCheck, FiX, FiUser, FiUsers, FiUserX, FiSearch, FiLoader, FiUserMinus, FiUserX as FiUserRemove, FiInfo } from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../../../scss/Components/Partials/FriendsSidebar.scss';
import '../../../../scss/Components/Partials/modalAndToast.scss';

// Create a custom event for friend request updates
export const FRIEND_REQUEST_UPDATE_EVENT = 'friendRequestUpdate';

const FriendsSidebar = ({ isOpen, onClose }) => {
  const [friendsList, setFriendsList] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('friends');
  const [loading, setLoading] = useState(true);
  const [actionInProgress, setActionInProgress] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [signedUrls, setSignedUrls] = useState({});

  // Fetch friends data with a useCallback to allow calling from other places
  const fetchFriendsData = useCallback(async () => {
    try {
      setLoading(true);
      
      
      const friendsResponse = await axios.get('/api/friends');
      console.log(friendsResponse.data);
      setFriendsList(friendsResponse.data || []);
      
      const requestsResponse = await axios.get('/api/friend-requests', {
        headers: {
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        withCredentials: true
      });
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
    if (isOpen) {
      fetchFriendsData();
      fetchSignedUrls();
    }
  }, [isOpen, fetchFriendsData]);

  // Set up polling for friend requests when the component mounts
  useEffect(() => {
    // Initial fetch
    fetchFriendsData();
    
    // Set up polling every 30 seconds
    const interval = setInterval(() => {
      fetchFriendsData();
    }, 30000);
    
    return () => clearInterval(interval);
  }, [fetchFriendsData]);

  const fetchSignedUrls = async () => {
    try {
      const response = await axios.get('/api/friends/signed-urls');
      setSignedUrls(response.data);
    } catch (error) {
      console.error('Error fetching signed URLs:', error);
      toast.error('Failed to load necessary data. Please try again.');
    }
  };

  const handleAddFriend = async (userId) => {
    try {
      setActionInProgress(userId);
      if (!signedUrls.sendRequest) {
        await fetchSignedUrls();
      }
      
      await axios.post(signedUrls.sendRequest, { user_id: userId });
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
      if (!signedUrls.acceptRequest) {
        await fetchSignedUrls();
      }
      
      const url = signedUrls.acceptRequest.replace('__ID__', requestId);
      await axios.post(url);
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
      if (!signedUrls.rejectRequest) {
        await fetchSignedUrls();
      }
      
      const url = signedUrls.rejectRequest.replace('__ID__', requestId);
      await axios.post(url);
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
      if (!signedUrls.removeFriend) {
        await fetchSignedUrls();
      }
      
      const url = signedUrls.removeFriend.replace('__ID__', friendId);
      await axios.delete(url);
      toast.info(`${friendName} has been removed from your friends`);
      fetchFriendsData();
      setActionInProgress(null);
    } catch (error) {
      console.error('Error removing friend:', error);
      toast.error('Failed to remove friend');
      setActionInProgress(null);
    }
  };

  const handleViewProfile = (userId) => {
    // Navigate to user profile or show profile modal
    console.log(`View profile of user ${userId}`);
  };

  const handleSearchUsers = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    
    try {
      setSearchLoading(true);
      const response = await axios.get('/api/users/search', { 
        params: { query } 
      });
      setSearchResults(response.data || []);
      setSearchLoading(false);
    } catch (error) {
      console.error('Error searching users:', error);
      toast.error('Failed to search users');
      setSearchLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'add') {
      const delayDebounceFn = setTimeout(() => {
        handleSearchUsers(searchQuery);
      }, 500);
      
      return () => clearTimeout(delayDebounceFn);
    }
  }, [searchQuery, activeTab]);

  // Use real data only
  const filteredFriends = friendsList.filter(friend => 
    friend.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    friend.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
              placeholder={activeTab === 'add' ? "Search users by name, username, or email..." : "Search friends..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label={activeTab === 'add' ? "Search users" : "Search friends"}
            />
          </div>
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
                          <img src={friend.avatar} alt={friend.username} />
                          <span className={`status-indicator ${friend.status}`}></span>
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
                            onClick={() => handleRemoveFriend(friend.id, friend.name)}
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
                          <img src={request.user.avatar} alt={request.user.username} />
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
                      ) : searchResults.length > 0 ? (
                        searchResults.map(user => (
                          <div key={user.id} className="user-item">
                            <div className="friend-avatar">
                              <img src={user.avatar} alt={user.username} />
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
                        ))
                      ) : (
                        <div className="empty-state">
                          <FiInfo />
                          <span>No users found matching your search</span>
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
    const response = await axios.get('/api/friend-requests/count', {
      headers: {
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      withCredentials: true
    });
    return response.data?.count || 0;
  } catch (error) {
    console.error('Error fetching friend request count:', error);
    return 0;
  }
};

export default FriendsSidebar; 