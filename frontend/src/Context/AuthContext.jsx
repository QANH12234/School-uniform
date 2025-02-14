import React, { createContext, useState, useContext, useEffect } from 'react';
import { login as loginApi, signup as signupApi } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Check if user is logged in on mount
        const checkAuth = async () => {
            try {
                const token = localStorage.getItem('auth-token');
                const storedUser = localStorage.getItem('user');

                if (token && storedUser) {
                    // Verify token with backend
                    const response = await fetch('http://localhost:4000/api/auth/me', {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if (response.ok) {
                        const data = await response.json();
                        if (data.success) {
                            setUser(data.user);
                            setIsAuthenticated(true);
                        } else {
                            // Clear invalid auth data
                            localStorage.removeItem('auth-token');
                            localStorage.removeItem('user');
                        }
                    }
                }
            } catch (error) {
                console.error('Auth check failed:', error);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    const login = async (userData, token) => {
        try {
            setLoading(true);
            setError(null);

            // Store auth data
            localStorage.setItem('auth-token', token);
            localStorage.setItem('user', JSON.stringify(userData));

            // Update state
            setUser(userData);
            setIsAuthenticated(true);

            return true;
        } catch (err) {
            setError(err.message);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        // Clear auth data
        localStorage.removeItem('auth-token');
        localStorage.removeItem('user');
        localStorage.removeItem('cart');

        // Reset state
        setUser(null);
        setIsAuthenticated(false);
        setError(null);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    const value = {
        user,
        isAuthenticated,
        loading,
        error,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext; 