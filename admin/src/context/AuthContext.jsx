import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Create a context for authentication
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // State to manage the current user
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Function to handle login
  const login = async (email, password) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/admin/login`, {
        email,
        password
      });
      
      // Store the token and user data
      localStorage.setItem('adminToken', response.data.token);
      setUser(response.data.admin);
      navigate('/dashboard');
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: 'Login failed'
      };
    }
  };

  // Function to handle logout
  const logout = () => {
    localStorage.removeItem('adminToken');
    setUser(null);
    navigate('/login');
  };

  // Context value to be provided
  const value = {
    user,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};