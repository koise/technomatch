import axios from 'axios';
window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// Add CSRF token to all requests
let token = document.head.querySelector('meta[name="csrf-token"]');

if (token) {
    window.axios.defaults.headers.common['X-CSRF-TOKEN'] = token.content;
} else {
    console.error('CSRF token not found: https://laravel.com/docs/csrf#csrf-x-csrf-token');
}

// For CSRF cookie-based authentication
window.axios.defaults.withCredentials = true;

// Add a function to refresh the CSRF token and session
window.refreshCSRFToken = async () => {
    try {
        console.log('🔄 Refreshing authentication session...');
        
        // Call a route that refreshes the session
        const response = await axios.get('/auth-check', {
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Accept': 'application/json',
            },
            withCredentials: true
        });
        
        console.log('✅ Auth session refreshed:', response.data);
        
        // Update CSRF token after refresh
        const refreshedToken = document.head.querySelector('meta[name="csrf-token"]');
        if (refreshedToken) {
            console.log('✅ CSRF token updated');
            window.axios.defaults.headers.common['X-CSRF-TOKEN'] = refreshedToken.content;
        }
        
        return response.data.authenticated;
    } catch (error) {
        console.error('❌ Failed to refresh authentication session:', error);
        return false;
    }
};

// Add interceptor to handle 401/419 errors by refreshing token and retrying
axios.interceptors.response.use(
    response => response, 
    async error => {
        // Only handle 401 (Unauthorized) or 419 (CSRF token mismatch) errors
        if (error.response && (error.response.status === 401 || error.response.status === 419)) {
            // Check if this is already a retry attempt to prevent infinite loops
            if (error.config.__isRetryRequest) {
                console.error('🔴 Authentication retry failed - giving up');
                return Promise.reject(error);
            }
            
            // Mark as retry request to prevent infinite loops
            error.config.__isRetryRequest = true;
            
            // Try to refresh CSRF token and session
            const isAuthenticated = await window.refreshCSRFToken();
            
            if (!isAuthenticated) {
                console.error('🔴 Failed to re-authenticate - user not authenticated');
                return Promise.reject(error);
            }
            
            console.log('🔄 Retrying original request after session refresh...');
            
            // Clone the original request with updated headers
            const newRequest = {
                ...error.config,
                headers: {
                    ...error.config.headers,
                    'X-CSRF-TOKEN': document.head.querySelector('meta[name="csrf-token"]')?.content
                }
            };
            
            // Retry the original request with refreshed session
            return axios(newRequest);
        }
        
        return Promise.reject(error);
    }
);
