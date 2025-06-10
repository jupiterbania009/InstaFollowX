import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const initializeAuth = async () => {
            const token = localStorage.getItem('token');
            
            if (token) {
                try {
                    // Set default authorization header
                    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                    
                    // Verify token and get user data
                    const response = await axios.get('/api/auth/verify');
                    setUser(response.data.user);
                    setIsAuthenticated(true);
                } catch (error) {
                    console.error('Token verification failed:', error);
                    localStorage.removeItem('token');
                    delete axios.defaults.headers.common['Authorization'];
                    setIsAuthenticated(false);
                    setUser(null);
                }
            }
            
            setIsLoading(false);
        };

        initializeAuth();
    }, []);

    const login = async (email, password) => {
        try {
            const response = await axios.post('/api/auth/login', { email, password });
            const { token, user } = response.data;
            
            localStorage.setItem('token', token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            
            setUser(user);
            setIsAuthenticated(true);
            
            return { success: true };
        } catch (error) {
            console.error('Login failed:', error);
            return {
                success: false,
                error: error.response?.data?.message || 'An error occurred during login'
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        setIsAuthenticated(false);
        setUser(null);
    };

    const value = {
        isAuthenticated,
        isLoading,
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

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext; 