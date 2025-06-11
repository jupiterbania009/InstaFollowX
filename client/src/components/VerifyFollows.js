import React, { useState, useEffect } from 'react';
import axios from '../utils/axios';
import { useAuth } from '../context/AuthContext';

const VerifyFollows = () => {
    const { user } = useAuth();
    const [followQueue, setFollowQueue] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [verificationCode, setVerificationCode] = useState('');
    const [instagramUsername, setInstagramUsername] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [points, setPoints] = useState(0);

    useEffect(() => {
        fetchFollowQueue();
        fetchPoints();
    }, []);

    const fetchPoints = async () => {
        try {
            const response = await axios.get('/follow/stats');
            setPoints(response.data.points);
        } catch (err) {
            console.error('Error fetching points:', err);
        }
    };

    const fetchFollowQueue = async () => {
        try {
            const response = await axios.get('/follow/queue');
            setFollowQueue(response.data);
            setError(null);
        } catch (err) {
            setError('Failed to load follow queue');
            console.error('Error fetching follow queue:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRequestFollow = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccessMessage('');

        try {
            const response = await axios.post('/follow/request', {
                instagramUsername
            });
            setSuccessMessage(`Follow requested! Your verification code is: ${response.data.verificationCode}. Share this code with the person who follows you.`);
            setInstagramUsername('');
            await Promise.all([fetchFollowQueue(), fetchPoints()]);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to request follow');
            console.error('Error requesting follow:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyFollow = async (followId) => {
        setIsLoading(true);
        setError(null);
        setSuccessMessage('');

        try {
            await axios.post('/follow/verify', {
                followId,
                verificationCode
            });
            setSuccessMessage('Follow verified successfully! You earned 2 points!');
            setVerificationCode('');
            await Promise.all([fetchFollowQueue(), fetchPoints()]);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to verify follow');
            console.error('Error verifying follow:', err);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading && followQueue.length === 0) {
        return (
            <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {error && (
                <div className="bg-red-500 text-white p-4 rounded mb-6">
                    {error}
                </div>
            )}

            {successMessage && (
                <div className="bg-green-500 text-white p-4 rounded mb-6">
                    {successMessage}
                </div>
            )}

            <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-white">Request Follow</h2>
                    <div className="text-purple-400">
                        Available Points: <span className="font-bold">{points}</span>
                    </div>
                </div>
                
                <div className="bg-gray-700 p-4 rounded mb-4">
                    <h3 className="text-white font-semibold mb-2">How it works:</h3>
                    <ul className="text-gray-300 list-disc list-inside space-y-1">
                        <li>Each follow request costs 1 point</li>
                        <li>You earn 2 points when someone verifies your follow</li>
                        <li>Share your verification code with the person who follows you</li>
                        <li>They'll use the code to verify the follow</li>
                    </ul>
                </div>

                <form onSubmit={handleRequestFollow} className="space-y-4">
                    <div>
                        <label htmlFor="instagramUsername" className="block text-gray-300 mb-1">
                            Instagram Username
                        </label>
                        <div className="flex gap-4">
                            <input
                                type="text"
                                id="instagramUsername"
                                value={instagramUsername}
                                onChange={(e) => setInstagramUsername(e.target.value)}
                                placeholder="Enter your Instagram username"
                                className="flex-1 px-4 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-purple-500"
                                required
                            />
                            <button
                                type="submit"
                                disabled={isLoading || points < 1}
                                className={`px-6 py-2 rounded font-semibold ${
                                    isLoading || points < 1
                                        ? 'bg-gray-600 cursor-not-allowed'
                                        : 'bg-purple-600 hover:bg-purple-700'
                                } text-white transition-colors`}
                            >
                                {points < 1 ? 'Not enough points' : 'Request Follow'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            <div className="bg-gray-800 rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-white mb-4">Follow Queue</h2>
                {followQueue.length === 0 ? (
                    <p className="text-gray-400">No pending follows in the queue</p>
                ) : (
                    <div className="space-y-4">
                        {followQueue.map((follow) => (
                            <div
                                key={follow._id}
                                className="bg-gray-700 rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                            >
                                <div>
                                    <p className="text-white font-semibold">
                                        @{follow.targetUsername}
                                    </p>
                                    <p className="text-sm text-gray-400">
                                        Requested by: {follow.requester}
                                    </p>
                                </div>
                                <div className="flex flex-col md:flex-row gap-2 md:items-center">
                                    <input
                                        type="text"
                                        placeholder="Enter verification code"
                                        value={verificationCode}
                                        onChange={(e) => setVerificationCode(e.target.value)}
                                        className="px-4 py-2 rounded bg-gray-600 text-white border border-gray-500 focus:outline-none focus:border-purple-500"
                                    />
                                    <button
                                        onClick={() => handleVerifyFollow(follow._id)}
                                        disabled={isLoading || !verificationCode}
                                        className={`px-4 py-2 rounded ${
                                            isLoading || !verificationCode
                                                ? 'bg-gray-600 cursor-not-allowed'
                                                : 'bg-green-600 hover:bg-green-700'
                                        } text-white transition-colors`}
                                    >
                                        Verify (+2 points)
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

export default VerifyFollows; 
