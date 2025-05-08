import axios from 'axios';
import { initAuth, api } from './auth';

// Test function to check all authentication-related API calls
export const testAuthentication = async () => {
  console.log('🔍 Starting authentication test...');
  
  try {
    // Step 1: Check if auth-check works
    console.log('Step 1: Testing auth-check endpoint...');
    const authCheck = await axios.get('/auth-check', {
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json',
      },
      withCredentials: true
    });
    console.log('✅ Auth check response:', authCheck.data);
    
    // Step 2: Initialize auth using our utility
    console.log('Step 2: Testing initAuth utility...');
    const isAuthenticated = await initAuth();
    console.log('✅ initAuth result:', isAuthenticated);
    
    if (!isAuthenticated) {
      console.error('❌ Authentication failed. Please log in.');
      return false;
    }
    
    // Step 3: Test friend request count endpoint using our new api client
    console.log('Step 3: Testing friend request count endpoint...');
    const friendRequestsCount = await api.get('/api/friend-requests/count');
    console.log('✅ Friend requests count response:', friendRequestsCount.data);
    
    // Step 4: Test friends list endpoint using our new api client
    console.log('Step 4: Testing friends list endpoint...');
    const friendsList = await api.get('/api/friends');
    console.log('✅ Friends list response:', friendsList.data);
    
    console.log('🎉 All authentication tests passed!');
    return true;
  } catch (error) {
    console.error('❌ Authentication test failed:', error);
    console.error('Error details:', error.response?.data || error.message);
    return false;
  }
};

// Export a function that can be run from the console
export const runAuthTest = () => {
  console.clear();
  console.log('📋 Running authentication test...');
  testAuthentication()
    .then(result => {
      if (result) {
        console.log('🟢 Authentication test completed successfully!');
      } else {
        console.log('🔴 Authentication test failed!');
      }
    })
    .catch(err => {
      console.error('🔴 Authentication test encountered an error:', err);
    });
};

// Auto-run the test when this module is imported directly in development
if (process.env.NODE_ENV !== 'production') {
  setTimeout(runAuthTest, 1000);
} 