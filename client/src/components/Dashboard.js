import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [followQueue, setFollowQueue] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [instagramUsername, setInstagramUsername] = useState('');
    const [verificationCode, setVerificationCode] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [statsRes, queueRes] = await Promise.all([
                axios.get('/api/follow/stats'),
                axios.get('/api/follow/queue')
            ]);
            setStats(statsRes.data);
            setFollowQueue(queueRes.data);
        } catch (error) {
            setError('Error fetching dashboard data');
            console.error('Dashboard error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRequestFollow = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const response = await axios.post('/api/follow/request', {
                instagramUsername
            });
            setVerificationCode(response.data.verificationCode);
            await fetchData(); // Refresh data
            setInstagramUsername('');
        } catch (error) {
            setError(error.response?.data?.message || 'Error requesting follow');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyFollow = async (followId, code) => {
        try {
            setLoading(true);
            await axios.post('/api/follow/verify', {
                followId,
                verificationCode: code
            });
            await fetchData(); // Refresh data
        } catch (error) {
            setError(error.response?.data?.message || 'Error verifying follow');
        } finally {
            setLoading(false);
        }
    };

    if (loading && !stats) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto">
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-gray-800 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-300 mb-2">Points</h3>
                    <p className="text-3xl font-bold text-purple-500">{stats?.points || 0}</p>
                </div>
                <div className="bg-gray-800 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-300 mb-2">Follows Given</h3>
                    <p className="text-3xl font-bold text-green-500">{stats?.followsGiven || 0}</p>
                </div>
                <div className="bg-gray-800 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-300 mb-2">Follows Received</h3>
                    <p className="text-3xl font-bold text-blue-500">{stats?.followsReceived || 0}</p>
                </div>
                <div className="bg-gray-800 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-300 mb-2">Pending Follows</h3>
                    <p className="text-3xl font-bold text-yellow-500">{stats?.pendingFollows || 0}</p>
                </div>
            </div>

            {/* Request Follow Section */}
            <div className="bg-gray-800 p-6 rounded-lg mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">Request Follows</h2>
                <form onSubmit={handleRequestFollow} className="flex gap-4">
                    <input
                        type="text"
                        value={instagramUsername}
                        onChange={(e) => setInstagramUsername(e.target.value)}
                        placeholder="Your Instagram username"
                        className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        required
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
                    >
                        Request Follow
                    </button>
                </form>
                {verificationCode && (
                    <div className="mt-4 p-4 bg-gray-700 rounded-lg">
                        <p className="text-white">
                            Your verification code: <span className="font-mono font-bold text-purple-400">{verificationCode}</span>
                        </p>
                        <p className="text-gray-400 text-sm mt-2">
                            Share this code with the person who follows you to verify the follow.
                        </p>
                    </div>
                )}
            </div>

            {/* Follow Queue Section */}
            <div className="bg-gray-800 p-6 rounded-lg">
                <h2 className="text-2xl font-bold text-white mb-4">Follow Queue</h2>
                {followQueue.length === 0 ? (
                    <p className="text-gray-400">No pending follows in the queue.</p>
                ) : (
                    <div className="space-y-4">
                        {followQueue.map((follow) => (
                            <div key={follow._id} className="flex items-center justify-between bg-gray-700 p-4 rounded-lg">
                                <div>
                                    <p className="text-white font-semibold">@{follow.targetUsername}</p>
                                    <p className="text-gray-400 text-sm">Requested by: {follow.follower.username}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <input
                                        type="text"
                                        placeholder="Enter verification code"
                                        className="px-4 py-2 bg-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        onChange={(e) => setVerificationCode(e.target.value)}
                                    />
                                    <button
                                        onClick={() => handleVerifyFollow(follow._id, verificationCode)}
                                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                    >
                                        Verify
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard; 
