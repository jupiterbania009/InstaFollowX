import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Dashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axios.get('/api/follow/stats');
                setStats(response.data);
                setError(null);
            } catch (err) {
                setError('Failed to load dashboard stats');
                console.error('Error fetching stats:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="bg-red-500 text-white p-4 rounded">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
                <h1 className="text-2xl font-bold text-white mb-2">
                    Welcome back, {user?.username}!
                </h1>
                <p className="text-gray-400">
                    Here's an overview of your Instagram follow activity
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gray-800 rounded-lg shadow-lg p-6">
                    <h3 className="text-lg font-semibold text-white mb-2">Points Balance</h3>
                    <p className="text-3xl font-bold text-purple-500">
                        {stats?.points || 0}
                    </p>
                    <p className="text-gray-400 text-sm mt-2">
                        Use points to get more followers
                    </p>
                </div>

                <div className="bg-gray-800 rounded-lg shadow-lg p-6">
                    <h3 className="text-lg font-semibold text-white mb-2">
                        Pending Follows
                    </h3>
                    <p className="text-3xl font-bold text-purple-500">
                        {stats?.pendingFollows || 0}
                    </p>
                    <p className="text-gray-400 text-sm mt-2">
                        Users you need to follow
                    </p>
                </div>

                <div className="bg-gray-800 rounded-lg shadow-lg p-6">
                    <h3 className="text-lg font-semibold text-white mb-2">
                        Follow Success Rate
                    </h3>
                    <p className="text-3xl font-bold text-purple-500">
                        {stats?.successRate || 0}%
                    </p>
                    <p className="text-gray-400 text-sm mt-2">
                        Percentage of successful follow exchanges
                    </p>
                </div>
            </div>

            <div className="bg-gray-800 rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Recent Activity</h2>
                {stats?.recentActivity?.length > 0 ? (
                    <div className="space-y-4">
                        {stats.recentActivity.map((activity, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between border-b border-gray-700 pb-4"
                            >
                                <div>
                                    <p className="text-white">{activity.description}</p>
                                    <p className="text-sm text-gray-400">
                                        {new Date(activity.timestamp).toLocaleDateString()}
                                    </p>
                                </div>
                                <span
                                    className={`px-3 py-1 rounded text-sm ${
                                        activity.type === 'earned'
                                            ? 'bg-green-500 text-white'
                                            : 'bg-purple-500 text-white'
                                    }`}
                                >
                                    {activity.type === 'earned' ? '+' : '-'}
                                    {activity.points} points
                                </span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-400">No recent activity to display</p>
                )}
            </div>
        </div>
    );
};

export default Dashboard; 