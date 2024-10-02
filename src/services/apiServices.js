import axios from 'axios';

const axiosInstance = axios.create({
  //baseURL: 'your_base_url_here', // Set your base URL
  headers: {
    'Content-Type': 'application/json',
    // You can set other default headers here if needed
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Token = `${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
});

axiosInstance.interceptors.response.use(null, (error) => {
  if (error.code === 'ERR_NETWORK') {
    error.response = {status: 404, statusText: 'Not Found'};
  }

  return Promise.reject(error);
});

export default {
  get: axiosInstance.get,
  post: axiosInstance.post,
  put: axiosInstance.put,
  delete: axiosInstance.delete,
  patch: axiosInstance.patch,
  isRequestCancelled: axiosInstance.isCancel,
};
