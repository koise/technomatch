import axios from 'axios';

// Function to check auth status and refresh session if needed
export const checkAuth = async () => {
  try {
    const response = await axios.get('/auth-check', {
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json',
      },
      withCredentials: true
    });
    
    return response.data.authenticated;
  } catch (error) {
    console.error('Auth check failed:', error);
    return false;
  }
};

// Initialize auth - call this before making authenticated API requests
export const initAuth = async () => {
  const isAuthenticated = await checkAuth();
  return isAuthenticated;
};

// Create an axios instance specifically for authenticated API calls
export const createAuthenticatedApiClient = () => {
  const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
  
  const apiClient = axios.create({
    baseURL: '/',
    withCredentials: true,
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-CSRF-TOKEN': csrfToken
    }
  });
  
  // Add a request interceptor to refresh auth before each request
  apiClient.interceptors.request.use(
    async (config) => {
      // Only check auth for API routes
      if (config.url.startsWith('/api/')) {
        await checkAuth(); // This refreshes the session
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
  
  return apiClient;
};

// Export a pre-configured api client instance
export const api = createAuthenticatedApiClient(); 