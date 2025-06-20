import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const { login, error } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        const success = await login(formData);
        
        if (success) {
            const from = location.state?.from?.pathname || '/dashboard';
            navigate(from);
        }
        
        setIsLoading(false);
    };

    return (
        <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-3xl font-bold text-white mb-6 text-center">
                    Welcome Back
                </h2>
                
                {error && (
                    <div className="bg-red-500 text-white p-3 rounded mb-4 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-gray-300 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-purple-500"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-gray-300 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-purple-500"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-2 rounded font-semibold ${
                            isLoading
                                ? 'bg-purple-700 cursor-not-allowed'
                                : 'bg-purple-600 hover:bg-purple-700'
                        } text-white transition-colors`}
                    >
                        {isLoading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <p className="mt-4 text-center text-gray-400">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-purple-400 hover:text-purple-300">
                        Register here
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login; 