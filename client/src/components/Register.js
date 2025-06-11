import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const { register, error } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        if (e.target.name === 'confirmPassword' || e.target.name === 'password') {
            setPasswordError('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (formData.password !== formData.confirmPassword) {
            setPasswordError('Passwords do not match');
            return;
        }
        
        setIsLoading(true);
        
        const success = await register({
            username: formData.username,
            email: formData.email,
            password: formData.password
        });
        
        if (success) {
            navigate('/dashboard');
        }
        
        setIsLoading(false);
    };

    return (
        <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-3xl font-bold text-white mb-6 text-center">
                    Create Account
                </h2>
                
                {(error || passwordError) && (
                    <div className="bg-red-500 text-white p-3 rounded mb-4 text-sm">
                        {error || passwordError}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="username" className="block text-gray-300 mb-1">
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-purple-500"
                            required
                        />
                    </div>

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

                    <div>
                        <label htmlFor="confirmPassword" className="block text-gray-300 mb-1">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
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
                        {isLoading ? 'Creating Account...' : 'Register'}
                    </button>
                </form>

                <p className="mt-4 text-center text-gray-400">
                    Already have an account?{' '}
                    <Link to="/login" className="text-purple-400 hover:text-purple-300">
                        Login here
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register; 