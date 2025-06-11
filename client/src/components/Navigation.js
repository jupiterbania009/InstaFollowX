import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navigation = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="bg-gray-800 shadow-lg">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                        <Link to="/" className="text-white text-xl font-bold">
                            InstaFollowX
                        </Link>
                    </div>

                    <div className="flex items-center space-x-4">
                        {isAuthenticated ? (
                            <>
                                <Link
                                    to="/dashboard"
                                    className={`text-sm ${
                                        isActive('/dashboard')
                                            ? 'text-purple-400'
                                            : 'text-gray-300 hover:text-white'
                                    }`}
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    to="/verify-follows"
                                    className={`text-sm ${
                                        isActive('/verify-follows')
                                            ? 'text-purple-400'
                                            : 'text-gray-300 hover:text-white'
                                    }`}
                                >
                                    Verify Follows
                                </Link>
                                <span className="text-gray-300 text-sm">
                                    {user?.username}
                                </span>
                                <button
                                    onClick={logout}
                                    className="bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700 transition-colors"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className={`text-sm ${
                                        isActive('/login')
                                            ? 'text-purple-400'
                                            : 'text-gray-300 hover:text-white'
                                    }`}
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className={`text-sm ${
                                        isActive('/register')
                                            ? 'text-purple-400'
                                            : 'text-gray-300 hover:text-white'
                                    }`}
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navigation; 