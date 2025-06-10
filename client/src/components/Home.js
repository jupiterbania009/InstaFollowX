import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="container mx-auto px-4 py-12">
            <nav className="flex justify-between items-center mb-16">
                <div className="flex items-center">
                    <img src="/logo.png" alt="InstaFollowX" className="h-8 w-8 mr-2" />
                    <span className="text-2xl font-bold text-purple-500">InstaFollowX</span>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={() => navigate('/login')}
                        className="px-4 py-2 text-white hover:text-purple-400"
                    >
                        Login
                    </button>
                    <button
                        onClick={() => navigate('/register')}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                    >
                        Register
                    </button>
                </div>
            </nav>

            <div className="text-center max-w-4xl mx-auto">
                <h1 className="text-5xl font-bold mb-6">
                    Grow Your Instagram Following
                </h1>
                <p className="text-xl text-gray-300 mb-8">
                    Exchange follows with real users and grow your Instagram presence. 
                    Earn points for following others and get followers in return!
                </p>
                <button
                    onClick={() => navigate('/register')}
                    className="px-8 py-4 bg-purple-600 text-white text-lg rounded-lg hover:bg-purple-700 transition-colors"
                >
                    Get Started Now
                </button>
            </div>

            <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-gray-800 p-6 rounded-lg">
                    <h3 className="text-xl font-bold mb-4">Create Your Account</h3>
                    <p className="text-gray-300">
                        Sign up with your desired username. No email verification required.
                    </p>
                </div>
                <div className="bg-gray-800 p-6 rounded-lg">
                    <h3 className="text-xl font-bold mb-4">Follow Other Users</h3>
                    <p className="text-gray-300">
                        Visit the dashboard and follow users from the queue. Each follow earns you 1 point.
                    </p>
                </div>
                <div className="bg-gray-800 p-6 rounded-lg">
                    <h3 className="text-xl font-bold mb-4">Get Followers</h3>
                    <p className="text-gray-300">
                        As you earn points, you'll be added to the follow queue. Other users will follow you, and you'll gain real followers!
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Home; 