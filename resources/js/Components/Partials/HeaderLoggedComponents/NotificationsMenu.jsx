import React, { useState, useEffect, useRef } from 'react';
import { FiBell, FiCode, FiAward, FiDollarSign, FiMessageSquare } from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../../../scss/Components/Partials/modalAndToast.scss';

const NotificationsMenu = ({ 
  notifications = [], 
  hasUnreadNotifications = false, 
  markNotificationAsRead, 
  markAllNotificationsAsRead,
  onNewNotification
}) => {
  // State
  const [showNotifications, setShowNotifications] = useState(false);
  const [animatedNotifications, setAnimatedNotifications] = useState(() => {
    // Initialize from localStorage if available
    try {
      const saved = localStorage.getItem('animatedNotifications');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch (err) {
      console.error("Error loading animated notifications from localStorage:", err);
      return new Set();
    }
  });

  // Refs
  const notificationsMenuRef = useRef(null);

  // Save animated notifications to localStorage when they change
  useEffect(() => {
    try {
      localStorage.setItem('animatedNotifications', JSON.stringify([...animatedNotifications]));
    } catch (err) {
      console.error("Error saving animated notifications to localStorage:", err);
    }
  }, [animatedNotifications]);

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

  // Show toast for new notifications
  useEffect(() => {
    // Find new unread notifications that haven't been animated yet
    const newNotifications = notifications.filter(notif => 
      !notif.read && !animatedNotifications.has(notif.id)
    );
    
    if (newNotifications.length > 0) {
      // Create a new set with all previously animated notifications plus new ones
      const updatedAnimated = new Set(animatedNotifications);
      
      // Show toast for each new notification and mark as animated
      newNotifications.forEach(notification => {
        showNotificationToast(notification);
        updatedAnimated.add(notification.id);
      });
      
      setAnimatedNotifications(updatedAnimated);
    }
  }, [notifications, animatedNotifications]);

  const showNotificationToast = (notification) => {
    // Only show toast for unread notifications
    if (notification.read) return;
    
    const toastTypeMap = {
      'challenge': 'success',
      'rank': 'info',
      'coin': 'info',
      'message': 'default'
    };
    
    const toastType = toastTypeMap[notification.type] || 'default';
    
    // Map icon string to actual icon component
    const iconMap = {
      'FiCode': <FiCode />,
      'FiAward': <FiAward />,
      'FiDollarSign': <FiDollarSign />,
      'FiMessageSquare': <FiMessageSquare />
    };
    
    const icon = typeof notification.icon === 'string' 
      ? iconMap[notification.icon] || <FiBell />
      : notification.icon;
    
    toast(
      <div className="notification-toast">
        <div className={`notification-icon ${notification.type}`}>
          {icon}
        </div>
        <div className="notification-content">
          <h4>{notification.title}</h4>
          <p>{notification.content}</p>
        </div>
      </div>,
      {
        position: "bottom-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        type: toastType,
        className: `notification-toast-${notification.type}`,
        toastId: `notification-${notification.id}`, // Prevent duplicate toasts
      }
    );
  };

  // Toggle notifications menu
  const toggleNotificationsMenu = () => {
    setShowNotifications(prev => !prev);
  };

  // Handle notification click
  const handleNotificationClick = (notificationId) => {
    if (markNotificationAsRead) {
      markNotificationAsRead(notificationId);
    }
  };

  // Clean up old notification IDs from localStorage to prevent it from growing too large
  useEffect(() => {
    try {
      // Get all notification IDs
      const allNotificationIds = new Set(notifications.map(n => n.id));
      
      // Filter animated notifications to only include current notifications
      const updatedAnimated = new Set(
        [...animatedNotifications].filter(id => allNotificationIds.has(id))
      );
      
      // Only update if we removed some IDs
      if (updatedAnimated.size < animatedNotifications.size) {
        setAnimatedNotifications(updatedAnimated);
      }
    } catch (err) {
      console.error("Error cleaning up animated notifications:", err);
    }
  }, [notifications]);

  return (
    <div className="dropdown-container" ref={notificationsMenuRef}>
      <ToastContainer
        position="bottom-left"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        limit={3}
      />
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
              notifications.map(notification => {
                // Map icon string to actual icon component
                const iconMap = {
                  'FiCode': <FiCode />,
                  'FiAward': <FiAward />,
                  'FiDollarSign': <FiDollarSign />,
                  'FiMessageSquare': <FiMessageSquare />
                };
                
                const icon = typeof notification.icon === 'string' 
                  ? iconMap[notification.icon] || <FiBell />
                  : notification.icon;
                
                return (
                  <div 
                    key={notification.id} 
                    className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                    onClick={() => handleNotificationClick(notification.id)}
                  >
                    <div className={`notification-icon ${notification.type}`}>
                      {icon}
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
                );
              })
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