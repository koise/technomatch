import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FiBell, FiCode, FiAward, FiDollarSign } from 'react-icons/fi';

const NotificationsMenu = () => {
  // State
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);

  // Refs
  const notificationsMenuRef = useRef(null);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationsMenuRef.current && !notificationsMenuRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Fetch notifications
  useEffect(() => {
    fetchNotifications();
  }, []);

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      // Mock notifications - replace with actual API call
      const mockNotifications = [
        {
          id: 1,
          type: 'challenge',
          title: 'New Challenge Available',
          content: 'Try our new React components challenge!',
          time: '10m ago',
          read: false,
          icon: <FiCode />
        },
        {
          id: 2,
          type: 'rank',
          title: 'Rank Updated',
          content: 'Congratulations! You reached TechnoMatch tier.',
          time: '2h ago',
          read: false,
          icon: <FiAward />
        },
        {
          id: 3,
          type: 'coin',
          title: 'Coins Awarded',
          content: 'You earned 50 coins for completing daily challenge.',
          time: '1d ago',
          read: true,
          icon: <FiDollarSign />
        }
      ];
      
      setNotifications(mockNotifications);
      setHasUnreadNotifications(mockNotifications.some(notif => !notif.read));
      
      // In a real app, use something like:
      // const response = await axios.get('/notifications');
      // setNotifications(response.data.notifications);
      // setHasUnreadNotifications(response.data.hasUnread);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  // Mark notification as read
  const markNotificationAsRead = async (notificationId) => {
    try {
      // Update local state first for immediate feedback
      setNotifications(prevNotifications => 
        prevNotifications.map(notif => 
          notif.id === notificationId 
            ? { ...notif, read: true } 
            : notif
        )
      );
      
      // Check if there are still any unread notifications
      const stillHasUnread = notifications.some(notif => 
        notif.id !== notificationId && !notif.read
      );
      setHasUnreadNotifications(stillHasUnread);
      
      // In a real app, send to server:
      // await axios.post('/mark-notification-read', { notificationId });
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  // Mark all notifications as read
  const markAllNotificationsAsRead = async () => {
    try {
      setNotifications(prevNotifications => 
        prevNotifications.map(notif => ({ ...notif, read: true }))
      );
      setHasUnreadNotifications(false);
      
      // In a real app, send to server:
      // await axios.post('/mark-all-notifications-read');
    } catch (err) {
      console.error("Error marking all notifications as read:", err);
    }
  };

  // Toggle notifications menu
  const toggleNotificationsMenu = useCallback(() => {
    setShowNotifications(prev => !prev);
  }, []);

  return (
    <div className="dropdown-container" ref={notificationsMenuRef}>
      <button 
        className="icon-button notification-button"
        onClick={toggleNotificationsMenu}
        aria-label="Notifications"
      >
        <FiBell className="icon" />
        {hasUnreadNotifications && <span className="notification-indicator"></span>}
      </button>

      {/* Notifications Dropdown */}
      {showNotifications && (
        <div className="dropdown-menu notifications-menu">
          <div className="dropdown-header">
            <h3>Notifications</h3>
            {hasUnreadNotifications && (
              <button 
                className="mark-all-read-button"
                onClick={markAllNotificationsAsRead}
              >
                Mark all as read
              </button>
            )}
          </div>
          
          <div className="notifications-list">
            {notifications.length > 0 ? (
              notifications.map(notification => (
                <div 
                  key={notification.id} 
                  className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                  onClick={() => markNotificationAsRead(notification.id)}
                >
                  <div className={`notification-icon ${notification.type}`}>
                    {notification.icon}
                  </div>
                  <div className="notification-content">
                    <div className="notification-header">
                      <h4>{notification.title}</h4>
                      <span className="notification-time">{notification.time}</span>
                    </div>
                    <p>{notification.content}</p>
                  </div>
                  {!notification.read && <div className="unread-dot"></div>}
                </div>
              ))
            ) : (
              <div className="empty-notifications">
                <p>No notifications yet</p>
              </div>
            )}
          </div>
          
          <div className="notifications-footer">
            <a href="/notifications">View all notifications</a>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsMenu;