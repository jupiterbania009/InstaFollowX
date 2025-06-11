import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] text-white">
            <h1 className="text-4xl md:text-6xl font-bold text-center mb-6">
                Welcome to <span className="text-purple-500">InstaFollowX</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 text-center max-w-2xl mb-8">
                Manage your Instagram followers efficiently with our advanced tools and analytics.
            </p>
            <div className="flex gap-4">
                <Link
                    to="/register"
                    className="bg-purple-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-purple-700 transition-colors"
                >
                    Get Started
                </Link>
                <Link
                    to="/login"
                    className="bg-gray-700 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-600 transition-colors"
                >
                    Login
                </Link>
            </div>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl">
                <div className="bg-gray-800 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold mb-3">Track Followers</h3>
                    <p className="text-gray-400">
                        Monitor your follower growth and identify unfollowers in real-time.
                    </p>
                </div>
                <div className="bg-gray-800 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold mb-3">Verify Follows</h3>
                    <p className="text-gray-400">
                        Ensure your follow-for-follow interactions are genuine and reciprocated.
                    </p>
                </div>
                <div className="bg-gray-800 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold mb-3">Analytics</h3>
                    <p className="text-gray-400">
                        Get detailed insights about your follower engagement and growth patterns.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Home; 