import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [followQueue, setFollowQueue] = useState([]);
    const [instagramUsername, setInstagramUsername] = useState('');
    const [isInitialized, setIsInitialized] = useState(false);
    const [error, setError] = useState('');

    const token = localStorage.getItem('token');

    useEffect(() => {
        if (token) {
            fetchStats();
            fetchFollowQueue();
        }
    }, [token]);

    const fetchStats = async () => {
        try {
            const response = await axios.get('/api/follow/stats', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStats(response.data);
        } catch (error) {
            console.error('Error fetching stats:', error);
            setError('Failed to load statistics');
        }
    };

    const fetchFollowQueue = async () => {
        try {
            const response = await axios.get('/api/follow/queue', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setFollowQueue(response.data);
        } catch (error) {
            console.error('Error fetching follow queue:', error);
            setError('Failed to load follow queue');
        }
    };

    const initializeProfile = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/follow/init', 
                { instagramUsername },
                { headers: { Authorization: `Bearer ${token}` }}
            );
            setIsInitialized(true);
            fetchStats();
            fetchFollowQueue();
        } catch (error) {
            console.error('Error initializing profile:', error);
            setError('Failed to initialize profile');
        }
    };

    const recordFollow = async (targetUserId, targetInstagramUsername) => {
        try {
            await axios.post('/api/follow/record',
                { targetUserId, targetInstagramUsername },
                { headers: { Authorization: `Bearer ${token}` }}
            );
            fetchStats();
            fetchFollowQueue();
        } catch (error) {
            console.error('Error recording follow:', error);
            setError('Failed to record follow');
        }
    };

    if (!isInitialized) {
        return (
            <div className="container mx-auto p-4">
                <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-2xl font-bold mb-4 text-purple-600">Initialize Your Profile</h2>
                    <form onSubmit={initializeProfile}>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Instagram Username</label>
                            <input
                                type="text"
                                value={instagramUsername}
                                onChange={(e) => setInstagramUsername(e.target.value)}
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors"
                        >
                            Start Growing
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}
            
            {/* Stats Section */}
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-semibold mb-2">Your Points</h3>
                        <p className="text-3xl font-bold text-purple-600">{stats.points}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-semibold mb-2">Follows Given</h3>
                        <p className="text-3xl font-bold text-purple-600">{stats.followsGiven}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-semibold mb-2">Follows Received</h3>
                        <p className="text-3xl font-bold text-purple-600">{stats.followsReceived}</p>
                    </div>
                </div>
            )}

            {/* Follow Queue Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-4">Users to Follow</h2>
                {followQueue.length === 0 ? (
                    <p className="text-gray-600">No users available to follow right now. Check back soon!</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {followQueue.map((user) => (
                            <div key={user._id} className="border rounded-lg p-4">
                                <p className="font-semibold mb-2">@{user.instagramUsername}</p>
                                <p className="text-sm text-gray-600 mb-2">Points: {user.points}</p>
                                <button
                                    onClick={() => recordFollow(user.userId, user.instagramUsername)}
                                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                                >
                                    Follow
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard; 