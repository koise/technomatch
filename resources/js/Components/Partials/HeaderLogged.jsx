import React, { useState, useEffect, useCallback } from 'react';
import { useTheme } from '../../context/ThemeContext';
import axios from 'axios';
import { FiAlertCircle } from 'react-icons/fi';
import '../../../scss/Components/Partials/HeaderLogged.scss';

import Logo from './HeaderLoggedComponents/Logo.jsx';
import Navigation from './HeaderLoggedComponents/Navigation.jsx';
import ProgressDisplay from './HeaderLoggedComponents/ProgressDisplay.jsx';
import CurrencyDisplay from './HeaderLoggedComponents/CurrencyDisplay.jsx';
import NotificationsMenu from './HeaderLoggedComponents/NotificationsMenu.jsx';
import SettingsMenu from './HeaderLoggedComponents/SettingsMenu.jsx';
import ProfileMenu from './HeaderLoggedComponents/ProfileMenu.jsx';
import FriendsButton from './HeaderLoggedComponents/FriendsButton.jsx';
import FriendsSidebar from './HeaderLoggedComponents/FriendsSidebar.jsx';

const HeaderLogged = () => {
  // Context and state
  const { darkMode, toggleTheme } = useTheme();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fontFamily, setFontFamily] = useState('var(--font-sans)');
  const [userStatus, setUserStatus] = useState('online');
  const [activeMode, setActiveMode] = useState('progressive');
  const [friendsSidebarOpen, setFriendsSidebarOpen] = useState(false);
  const [friendRequestCount, setFriendRequestCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
  
  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/fetch-user');
        if (response.data && response.data.user) {
          setUserData(response.data.user);
          console.log(response.data.user);
          if (response.data.user.profile) {
            // Set font preference
            if (response.data.user.profile.preferred_font) {
              setFontFamily(response.data.user.profile.preferred_font);
            }
            
            // Set user status
            if (response.data.user.profile.online_status) {
              setUserStatus(response.data.user.profile.online_status);
            }

            // Set active game mode if available
            if (response.data.user.profile.game_mode) {
              setActiveMode(response.data.user.profile.game_mode);
            }
          }
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to load user data");
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        // In a real app, replace with actual API call
        // const response = await axios.get('/api/notifications');
        // setNotifications(response.data.notifications);
        // setHasUnreadNotifications(response.data.notifications.some(notif => !notif.read));
        
        // Mock notifications for now
        const mockNotifications = [
          {
            id: 1,
            type: 'challenge',
            title: 'New Challenge Available',
            content: 'Try our new React components challenge!',
            time: '10m ago',
            read: false,
            icon: 'FiCode'
          },
          {
            id: 2,
            type: 'rank',
            title: 'Rank Updated',
            content: 'Congratulations! You reached TechnoMatch tier.',
            time: '2h ago',
            read: false,
            icon: 'FiAward'
          },
          {
            id: 3,
            type: 'coin',
            title: 'Coins Awarded',
            content: 'You earned 50 coins for completing daily challenge.',
            time: '1d ago',
            read: true,
            icon: 'FiDollarSign'
          }
        ];
        
        setNotifications(mockNotifications);
        setHasUnreadNotifications(mockNotifications.some(notif => !notif.read));
      } catch (err) {
        console.error("Error fetching notifications:", err);
      }
    };

    fetchNotifications();
    
    // Set up polling for notifications
    const interval = setInterval(fetchNotifications, 60000); // Every minute
    
    return () => clearInterval(interval);
  }, []);

  // Set up WebSocket connection for real-time notifications
  useEffect(() => {
    // Skip if user is not loaded yet
    if (!userData || !userData.id) return;

    // Connect to WebSocket server
    // In a real app, use something like:
    // const socket = new WebSocket(`wss://your-websocket-server.com/ws/notifications/${userData.id}`);
    
    // For this example, we'll simulate WebSocket events with a timer
    const notificationTypes = ['challenge', 'rank', 'coin', 'message'];
    const notificationIcons = ['FiCode', 'FiAward', 'FiDollarSign', 'FiMessageSquare'];
    const notificationTitles = [
      'New Challenge', 
      'Rank Updated', 
      'Coins Earned',
      'New Message'
    ];
    const notificationContents = [
      'A new coding challenge is available for you!',
      'Your rank has been updated based on recent activity.',
      'You earned coins for your contributions.',
      'You received a new message from another developer.'
    ];
    
    // Simulate receiving notifications every 15-30 seconds
    const interval = setInterval(() => {
      // Only 20% chance to receive a notification on each interval
      if (Math.random() > 0.2) return;
      
      const typeIndex = Math.floor(Math.random() * notificationTypes.length);
      const newNotification = {
        id: Date.now(),
        type: notificationTypes[typeIndex],
        title: notificationTitles[typeIndex],
        content: notificationContents[typeIndex],
        time: 'Just now',
        read: false,
        icon: notificationIcons[typeIndex]
      };
      
      handleNewNotification(newNotification);
    }, Math.random() * 15000 + 15000); // Random interval between 15-30 seconds
    
    return () => {
      clearInterval(interval);
      // In a real app: socket.close();
    };
  }, [userData]);

  // Fetch friend request count
  useEffect(() => {
    const fetchFriendRequests = async () => {
      try {
        const response = await axios.get('/api/friend-requests/count');
        if (response.data && response.data.count !== undefined) {
          setFriendRequestCount(response.data.count);
        }
      } catch (err) {
        console.error("Error fetching friend requests count:", err);
      }
    };

    fetchFriendRequests();
    
    // Set up polling for friend requests
    const interval = setInterval(fetchFriendRequests, 60000); // Every minute
    
    return () => clearInterval(interval);
  }, []);

  // Apply font family to document
  useEffect(() => {
    document.documentElement.style.setProperty('--applied-font', fontFamily);
  }, [fontFamily]);
  
  // Update user status in the backend
  const updateUserStatus = async (status) => {
    try {
      await axios.post('/update-user-status', { status });
    } catch (err) {
      console.error("Error updating user status:", err);
    }
  };
  
  // Update user preferences
  const updateUserPreference = async (preference, value) => {
    try {
      await axios.post('/update-user-preference', { preference, value });
    } catch (err) {
      console.error(`Error updating user ${preference}:`, err);
    }
  };
  
  // Toggle dark mode and save preference
  const handleToggleTheme = useCallback(() => {
    toggleTheme();
    updateUserPreference('dark_mode', !darkMode);
  }, [darkMode, toggleTheme]);
  
  // Update font preference
  const handleFontChange = useCallback((fontValue) => {
    setFontFamily(fontValue);
    updateUserPreference('preferred_font', fontValue);
  }, []);

  // Toggle user status between online and offline
  const toggleOnlineStatus = useCallback(() => {
    const newStatus = userStatus === 'online' ? 'offline' : 'online';
    setUserStatus(newStatus);
    updateUserStatus(newStatus);
  }, [userStatus]);
  
  // Game mode handling
  const handleGameModeChange = useCallback((mode) => {
    setActiveMode(mode);
    updateUserPreference('game_mode', mode);
  }, []);

  // Toggle friends sidebar
  const toggleFriendsSidebar = useCallback(() => {
    setFriendsSidebarOpen(prev => !prev);
  }, []);

  // Handle new notification
  const handleNewNotification = useCallback((notification) => {
    setNotifications(prev => [notification, ...prev]);
    setHasUnreadNotifications(true);
  }, []);

  // Mark notification as read
  const markNotificationAsRead = useCallback((notificationId) => {
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
  }, [notifications]);

  // Mark all notifications as read
  const markAllNotificationsAsRead = useCallback(() => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notif => ({ ...notif, read: true }))
    );
    setHasUnreadNotifications(false);
    
    // In a real app, send to server:
    // await axios.post('/mark-all-notifications-read');
  }, []);

  // Loading and error states
  if (loading) {
    return (
      <header className="technomatch-header">
        <div className="header-container loading-container">
          <Logo />
          <div className="loading-indicator">Loading user profile...</div>
        </div>
      </header>
    );
  }

  if (error) {
    return (
      <header className="technomatch-header">
        <div className="header-container error-container">
          <Logo />
          <div className="error-message">
            <FiAlertCircle className="error-icon" />
            Error: {error}
          </div>
        </div>
      </header>
    );
  }

  if (!userData) {
    return (
      <header className="technomatch-header">
        <div className="header-container error-container">
          <Logo />
          <div className="error-message">
            <FiAlertCircle className="error-icon" />
            No user data available
          </div>
        </div>
      </header>
    );
  }

  return (
    <>
      <header className="technomatch-header">
        <div className="header-container">
          {/* Logo */}
          <Logo />

          {/* Navigation with Play Button in the middle */}
          <Navigation 
            userStatus={userStatus} 
            setUserStatus={setUserStatus}
            activeMode={activeMode}
            onGameModeChange={handleGameModeChange}
            updateUserStatus={updateUserStatus}
          />

          <div className="header-actions">
            {/* Progress/Rank Display */}
            <ProgressDisplay 
              userData={userData}
              activeMode={activeMode}
            />

            {/* Currency Display */}
            <CurrencyDisplay 
              amount={userData.profile?.currency || 942}
            />

            {/* Notifications */}
            <NotificationsMenu 
              notifications={notifications}
              hasUnreadNotifications={hasUnreadNotifications}
              markNotificationAsRead={markNotificationAsRead}
              markAllNotificationsAsRead={markAllNotificationsAsRead}
              onNewNotification={handleNewNotification}
            />

            {/* Settings */}
            <SettingsMenu 
              darkMode={darkMode}
              fontFamily={fontFamily}
              userStatus={userStatus}
              handleToggleTheme={handleToggleTheme}
              handleFontChange={handleFontChange}
              toggleOnlineStatus={toggleOnlineStatus}
            />
            
            {/* Friends Button */}
            <FriendsButton 
              toggleFriendsSidebar={toggleFriendsSidebar}
              friendRequestCount={friendRequestCount}
            />

            {/* User Profile */}
            <ProfileMenu 
              userData={userData}
              userStatus={userStatus}
            />
          </div>
        </div>
      </header>
      
      {/* Friends Sidebar */}
      <FriendsSidebar 
        isOpen={friendsSidebarOpen}
        onClose={() => setFriendsSidebarOpen(false)}
      />
    </>
  );
};

export default HeaderLogged;