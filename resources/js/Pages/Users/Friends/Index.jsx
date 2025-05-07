import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

// Components
import UserLayout from '@/Layouts/UserLayout';
import { FiUserPlus, FiUserX, FiSearch, FiUser, FiMessageSquare } from 'react-icons/fi';

export default function FriendsIndex() {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [signedUrls, setSignedUrls] = useState({});
  const [actionInProgress, setActionInProgress] = useState(null);

  // Fetch friends data
  const fetchFriends = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/friends');
      setFriends(response.data);
    } catch (error) {
      console.error('Error fetching friends:', error);
      toast.error('Failed to load friends');
    } finally {
      setLoading(false);
    }
  };

  // Fetch signed URLs for friend operations
  const fetchSignedUrls = async () => {
    try {
      const response = await axios.get('/api/friends/signed-urls');
      setSignedUrls(response.data);
    } catch (error) {
      console.error('Error fetching signed URLs:', error);
    }
  };

  useEffect(() => {
    fetchFriends();
    fetchSignedUrls();
  }, []);

  // Handle removing a friend
  const handleRemoveFriend = async (friendId, friendName) => {
    try {
      setActionInProgress(friendId);
      
      if (!signedUrls.removeFriend) {
        await fetchSignedUrls();
      }
      
      const url = signedUrls.removeFriend.replace('__ID__', friendId);
      await axios.delete(url);
      
      toast.success(`${friendName} has been removed from your friends`);
      fetchFriends();
    } catch (error) {
      console.error('Error removing friend:', error);
      toast.error('Failed to remove friend');
    } finally {
      setActionInProgress(null);
    }
  };

  // Filter friends based on search query
  const filteredFriends = friends.filter(friend => 
    friend.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    friend.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <UserLayout>
      <Head title="My Friends" />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Friends</h1>
          <div className="flex items-center">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search friends..."
                className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {filteredFriends.length === 0 ? (
              <div className="text-center py-12">
                <FiUser className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium">No friends found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {friends.length === 0 
                    ? "You don't have any friends yet. Go to the search page to find and add new friends."
                    : "No friends match your search criteria."}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredFriends.map((friend) => (
                  <motion.div
                    key={friend.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
                  >
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="relative">
                          <img
                            src={friend.avatar || '/avatar/default.svg'}
                            alt={friend.name}
                            className="h-14 w-14 rounded-full object-cover"
                          />
                          <span className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${
                            friend.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                          }`}></span>
                        </div>
                        <div className="ml-4 flex-1">
                          <h3 className="text-lg font-semibold">{friend.name}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">@{friend.username}</p>
                        </div>
                      </div>
                      
                      <div className="mt-5 flex justify-between">
                        <button
                          className="flex items-center px-3 py-1.5 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
                        >
                          <FiMessageSquare className="mr-1.5" />
                          Message
                        </button>
                        
                        <button
                          className="flex items-center px-3 py-1.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                          onClick={() => handleRemoveFriend(friend.id, friend.name)}
                          disabled={actionInProgress === friend.id}
                        >
                          {actionInProgress === friend.id ? (
                            <span className="animate-pulse">Processing...</span>
                          ) : (
                            <>
                              <FiUserX className="mr-1.5" />
                              Remove
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </UserLayout>
  );
} 