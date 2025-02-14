import axios from 'axios';

// Define the API URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

// Function to handle login
export const login = async (email, password) => {
  try {
    // Send a POST request to the login endpoint with email and password
    const response = await axios.post(`${API_URL}/api/admin/login`, {
      email,
      password,
    });
    // If the response contains a token, store it in localStorage
    if (response.data.token) {
      localStorage.setItem('admin_token', response.data.token);
      localStorage.setItem('admin_user', JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error) {
    // Throw an error if login fails
    throw error.response?.data || { error: 'Failed to login' };
  }
};

// Function to handle logout
export const logout = () => {
  // Remove the token and user data from localStorage
  localStorage.removeItem('admin_token');
  localStorage.removeItem('admin_user');
};

// Function to get the current admin user from localStorage
export const getCurrentAdmin = () => {
  const adminStr = localStorage.getItem('admin_user');
  return adminStr ? JSON.parse(adminStr) : null;
};

// Function to get the token from localStorage
export const getToken = () => {
  return localStorage.getItem('admin_token');
};