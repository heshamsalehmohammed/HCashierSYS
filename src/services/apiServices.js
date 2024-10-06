import axios from 'axios';

const axiosInstance = axios.create({
  // baseURL: 'your_base_url_here', // Uncomment and set your base URL if needed
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor to attach token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Use Authorization header with Bearer token
    }
    return config;
  },
  (error) => {
    return Promise.reject(error); // Handle request error
  }
);

// Response interceptor to handle errors
axiosInstance.interceptors.response.use(
  (response) => response, // Pass through successful responses
  (error) => {
    if (error.code === 'ERR_NETWORK') {
      // Handle network errors
      error.response = { status: 404, statusText: 'Not Found' };
    }
    if (error.response && error.response.status === 401) {
      // Handle unauthorized access (token might be expired)
      console.log('Unauthorized! Token might be expired.');
      // You can redirect to login page or handle token refresh here if needed
    }
    return Promise.reject(error); // Propagate the error
  }
);

// Exporting HTTP methods for reuse
export default {
  get: axiosInstance.get,
  post: axiosInstance.post,
  put: axiosInstance.put,
  delete: axiosInstance.delete,
  patch: axiosInstance.patch,
  isRequestCancelled: axios.isCancel, // Axios' method for checking request cancellation
  axiosInstance, // Export the instance itself if needed for custom requests
};
