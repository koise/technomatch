import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Link } from '@inertiajs/react';

// Components
import UserLayout from '@/Layouts/UserLayout';
import { FiUserCheck, FiUserX, FiUser, FiArrowLeft } from 'react-icons/fi';

export default function FriendRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [signedUrls, setSignedUrls] = useState({});
  const [actionInProgress, setActionInProgress] = useState(null);

  // Fetch friend requests
  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/friend-requests');
      setRequests(response.data);
    } catch (error) {
      console.error('Error fetching friend requests:', error);
      toast.error('Failed to load friend requests');
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
    fetchRequests();
    fetchSignedUrls();
  }, []);

  // Handle accepting a friend request
  const handleAcceptRequest = async (requestId, username) => {
    try {
      setActionInProgress(requestId);
      
      if (!signedUrls.acceptRequest) {
        await fetchSignedUrls();
      }
      
      const url = signedUrls.acceptRequest.replace('__ID__', requestId);
      await axios.post(url);
      
      toast.success(`You are now friends with ${username}`);
      fetchRequests();
    } catch (error) {
      console.error('Error accepting friend request:', error);
      toast.error('Failed to accept friend request');
    } finally {
      setActionInProgress(null);
    }
  };

  // Handle rejecting a friend request
  const handleRejectRequest = async (requestId, username) => {
    try {
      setActionInProgress(requestId);
      
      if (!signedUrls.rejectRequest) {
        await fetchSignedUrls();
      }
      
      const url = signedUrls.rejectRequest.replace('__ID__', requestId);
      await axios.post(url);
      
      toast.success(`Friend request from ${username} rejected`);
      fetchRequests();
    } catch (error) {
      console.error('Error rejecting friend request:', error);
      toast.error('Failed to reject friend request');
    } finally {
      setActionInProgress(null);
    }
  };

  return (
    <UserLayout>
      <Head title="Friend Requests" />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Link href={route('friends.index')} className="mr-4 text-blue-500 hover:text-blue-700">
            <FiArrowLeft className="inline-block mr-1" />
            Back to Friends
          </Link>
          <h1 className="text-2xl font-bold">Friend Requests</h1>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {requests.length === 0 ? (
              <div className="text-center py-12">
                <FiUser className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium">No pending friend requests</h3>
                <p className="mt-1 text-sm text-gray-500">
                  You don't have any pending friend requests right now.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {requests.map((request) => (
                  <motion.div
                    key={request.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
                  >
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="relative">
                          <img
                            src={request.user.avatar || '/avatar/default.svg'}
                            alt={request.user.name}
                            className="h-14 w-14 rounded-full object-cover"
                          />
                        </div>
                        <div className="ml-4 flex-1">
                          <h3 className="text-lg font-semibold">{request.user.name}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">@{request.user.username}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            Sent {new Date(request.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="mt-5 flex justify-between">
                        <button
                          className="flex items-center px-4 py-2 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50"
                          onClick={() => handleAcceptRequest(request.id, request.user.username)}
                          disabled={actionInProgress === request.id}
                        >
                          {actionInProgress === request.id ? (
                            <span className="animate-pulse">Processing...</span>
                          ) : (
                            <>
                              <FiUserCheck className="mr-2" />
                              Accept
                            </>
                          )}
                        </button>
                        
                        <button
                          className="flex items-center px-4 py-2 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50"
                          onClick={() => handleRejectRequest(request.id, request.user.username)}
                          disabled={actionInProgress === request.id}
                        >
                          {actionInProgress === request.id ? (
                            <span className="animate-pulse">Processing...</span>
                          ) : (
                            <>
                              <FiUserX className="mr-2" />
                              Decline
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