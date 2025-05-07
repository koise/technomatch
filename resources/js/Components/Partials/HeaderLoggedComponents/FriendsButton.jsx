import React, { useState, useEffect } from 'react';
import { FiUsers } from 'react-icons/fi';
import { FRIEND_REQUEST_UPDATE_EVENT, getFriendRequestCount } from './FriendsSidebar';

const FriendsButton = ({ toggleFriendsSidebar }) => {
  const [friendRequestCount, setFriendRequestCount] = useState(0);

  useEffect(() => {
    // Initial fetch of friend request count
    const fetchRequestCount = async () => {
      const count = await getFriendRequestCount();
      setFriendRequestCount(count);
    };
    
    fetchRequestCount();

    // Listen for friend request updates
    const handleFriendRequestUpdate = (event) => {
      setFriendRequestCount(event.detail.count);
    };

    window.addEventListener(FRIEND_REQUEST_UPDATE_EVENT, handleFriendRequestUpdate);

    return () => {
      window.removeEventListener(FRIEND_REQUEST_UPDATE_EVENT, handleFriendRequestUpdate);
    };
  }, []);

  return (
    <div 
      className="header-icon-button friends-button" 
      onClick={toggleFriendsSidebar}
      title={friendRequestCount > 0 ? `${friendRequestCount} friend request${friendRequestCount !== 1 ? 's' : ''}` : 'Friends'}
    >
      <FiUsers className="icon" />
      {friendRequestCount > 0 && (
        <span className="notification-badge">{friendRequestCount}</span>
      )}
    </div>
  );
};

export default FriendsButton; 