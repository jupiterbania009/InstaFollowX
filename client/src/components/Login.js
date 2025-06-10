import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = ({ setIsAuthenticated }) => {
    const [isEmailLogin, setIsEmailLogin] = useState(true);
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password: '',
        otp: ''
    });
    const [error, setError] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleUsernameLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/auth/login', {
                username: formData.username,
                password: formData.password
            });

            localStorage.setItem('token', response.data.token);
            setIsAuthenticated(true);
            navigate('/dashboard');
        } catch (error) {
            setError(error.response?.data?.message || 'An error occurred');
        }
    };

    const handleRequestOTP = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/auth/request-otp', {
                email: formData.email,
                password: formData.password
            });
            setOtpSent(true);
            setError('');
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to send OTP');
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/auth/verify-otp', {
                email: formData.email,
                otp: formData.otp
            });

            localStorage.setItem('token', response.data.token);
            setIsAuthenticated(true);
            navigate('/dashboard');
        } catch (error) {
            setError(error.response?.data?.message || 'Invalid OTP');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-white">Login to Your Account</h2>
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <div className="flex mb-6">
                    <button
                        className={`flex-1 py-2 ${isEmailLogin ? 'text-purple-500 border-b-2 border-purple-500' : 'text-gray-400'}`}
                        onClick={() => setIsEmailLogin(true)}
                    >
                        Email Login
                    </button>
                    <button
                        className={`flex-1 py-2 ${!isEmailLogin ? 'text-purple-500 border-b-2 border-purple-500' : 'text-gray-400'}`}
                        onClick={() => setIsEmailLogin(false)}
                    >
                        Username Login
                    </button>
                </div>

                {isEmailLogin ? (
                    <form onSubmit={otpSent ? handleVerifyOTP : handleRequestOTP}>
                        <div className="mb-4">
                            <label className="block text-gray-300 mb-2">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                required
                            />
                        </div>
                        {!otpSent && (
                            <div className="mb-6">
                                <label className="block text-gray-300 mb-2">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    required
                                />
                            </div>
                        )}
                        {otpSent && (
                            <div className="mb-6">
                                <label className="block text-gray-300 mb-2">Enter OTP</label>
                                <input
                                    type="text"
                                    name="otp"
                                    value={formData.otp}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    required
                                />
                            </div>
                        )}
                        <button
                            type="submit"
                            className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors"
                        >
                            {otpSent ? 'Verify OTP' : 'Request OTP'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleUsernameLogin}>
                        <div className="mb-4">
                            <label className="block text-gray-300 mb-2">Username</label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                required
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-300 mb-2">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors"
                        >
                            Login
                        </button>
                    </form>
                )}

                <div className="mt-6 text-center">
                    <p className="text-gray-400">
                        Don't have an account?{' '}
                        <button
                            onClick={() => navigate('/register')}
                            className="text-purple-500 hover:text-purple-400"
                        >
                            Register
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login; 