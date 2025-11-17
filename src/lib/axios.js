import axios from 'axios';

const BASE_URL = 'https://jamia-hub-backend.vercel.app/api'

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // CRITICAL: This sends cookies with every request
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add request interceptor for debugging
axiosInstance.interceptors.request.use(
  (config) => {
    console.log('Request:', config.method.toUpperCase(), config.url);
    console.log('Cookies being sent:', document.cookie);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('Response error:', error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

export const getAuthUser = async () => {
  try {
    const response = await axiosInstance.get('/auth/me');
    console.log('Auth user response:', response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching auth user:", error.response?.data || error.message);
    // Don't throw error if unauthorized - just return null
    if (error.response?.status === 401) {
      return { user: null };
    }
    throw error;
  }
};