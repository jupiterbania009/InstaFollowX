import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            verifyToken(token);
        } else {
            setIsLoading(false);
        }
    }, []);

    const verifyToken = async (token) => {
        try {
            const response = await axios.get('/api/auth/verify', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUser(response.data.user);
            setIsLoading(false);
        } catch (error) {
            console.error('Token verification failed:', error);
            localStorage.removeItem('token');
            setUser(null);
            setIsLoading(false);
        }
    };

    const login = async (credentials) => {
        try {
            const response = await axios.post('/api/auth/login', credentials);
            const { token, user } = response.data;
            localStorage.setItem('token', token);
            setUser(user);
            setError(null);
            return true;
        } catch (error) {
            setError(error.response?.data?.message || 'Login failed');
            return false;
        }
    };

    const register = async (userData) => {
        try {
            const response = await axios.post('/api/auth/register', userData);
            const { token, user } = response.data;
            localStorage.setItem('token', token);
            setUser(user);
            setError(null);
            return true;
        } catch (error) {
            setError(error.response?.data?.message || 'Registration failed');
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    const value = {
        user,
        isAuthenticated: !!user,
        isLoading,
        error,
        login,
        register,
        logout
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext; 