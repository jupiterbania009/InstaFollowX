import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navigation = ({ isAuthenticated, setIsAuthenticated }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        navigate('/');
    };

    return (
        <nav className="bg-gray-800 py-4">
            <div className="container mx-auto px-4 flex justify-between items-center">
                <Link to="/" className="flex items-center">
                    <img src="/logo.png" alt="InstaFollowX" className="h-8 w-8 mr-2" />
                    <span className="text-2xl font-bold text-purple-500">InstaFollowX</span>
                </Link>

                <div className="flex items-center space-x-4">
                    {isAuthenticated ? (
                        <>
                            <Link 
                                to="/dashboard" 
                                className="text-white hover:text-purple-400"
                            >
                                Dashboard
                            </Link>
                            <Link 
                                to="/verify-follows" 
                                className="text-white hover:text-purple-400"
                            >
                                Verify Follows
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link 
                                to="/login" 
                                className="text-white hover:text-purple-400"
                            >
                                Login
                            </Link>
                            <Link 
                                to="/register" 
                                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                            >
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navigation; 