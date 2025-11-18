import axios from 'axios';

const BASE_URL = 'https://jamia-hub-backend.vercel.app/api'

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add token from localStorage to all requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Token attached to request');
    }
    console.log('Request:', config.method.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Handle responses and errors
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('Response error:', error.response?.status, error.response?.data);
    
    // If unauthorized, clear token
    if (error.response?.status === 401) {
      console.log('Unauthorized - clearing token');
      localStorage.removeItem('jwt');
    }
    
    return Promise.reject(error);
  }
);

export const getAuthUser = async () => {
  try {
    const token = localStorage.getItem('jwt');
    if (!token) {
      console.log('No token found in localStorage');
      return { user: null };
    }
    
    console.log('Fetching auth user with token');
    const response = await axiosInstance.get('/auth/me');
    console.log('Auth user response:', response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching auth user:", error.response?.data || error.message);
    
    // If unauthorized, clear token and return null
    if (error.response?.status === 401) {
      localStorage.removeItem('jwt');
      return { user: null };
    }
    
    throw error;
  }
};