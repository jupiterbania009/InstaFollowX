import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FollowVerification = () => {
    const [pendingFollows, setPendingFollows] = useState([]);
    const [error, setError] = useState('');
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (token) {
            fetchPendingFollows();
        }
    }, [token]);

    const fetchPendingFollows = async () => {
        try {
            const response = await axios.get('/api/follow/stats', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const unverifiedFollows = response.data.followsReceived.filter(f => !f.verified);
            setPendingFollows(unverifiedFollows);
        } catch (error) {
            console.error('Error fetching pending follows:', error);
            setError('Failed to load pending follows');
        }
    };

    const verifyFollow = async (followId) => {
        try {
            await axios.post('/api/follow/verify',
                { followId },
                { headers: { Authorization: `Bearer ${token}` }}
            );
            fetchPendingFollows();
        } catch (error) {
            console.error('Error verifying follow:', error);
            setError('Failed to verify follow');
        }
    };

    return (
        <div className="container mx-auto p-4">
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-4">Pending Follow Verifications</h2>
                {pendingFollows.length === 0 ? (
                    <p className="text-gray-600">No pending follows to verify!</p>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {pendingFollows.map((follow) => (
                            <div key={follow._id} className="border rounded-lg p-4 flex justify-between items-center">
                                <div>
                                    <p className="font-semibold">@{follow.instagramUsername}</p>
                                    <p className="text-sm text-gray-600">
                                        Followed you on {new Date(follow.timestamp).toLocaleDateString()}
                                    </p>
                                </div>
                                <button
                                    onClick={() => verifyFollow(follow._id)}
                                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                                >
                                    Verify Follow
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FollowVerification; 