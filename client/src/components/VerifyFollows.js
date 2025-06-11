import React, { useState, useEffect } from 'react';
import axios from 'axios';

const VerifyFollows = () => {
    const [followQueue, setFollowQueue] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [verificationCode, setVerificationCode] = useState('');
    const [instagramUsername, setInstagramUsername] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        fetchFollowQueue();
    }, []);

    const fetchFollowQueue = async () => {
        try {
            const response = await axios.get('/api/follow/queue');
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
            const response = await axios.post('/api/follow/request', {
                instagramUsername
            });
            setSuccessMessage(`Follow requested! Your verification code is: ${response.data.verificationCode}`);
            setInstagramUsername('');
            await fetchFollowQueue();
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
            await axios.post('/api/follow/verify', {
                followId,
                verificationCode
            });
            setSuccessMessage('Follow verified successfully!');
            setVerificationCode('');
            await fetchFollowQueue();
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
                <h2 className="text-2xl font-bold text-white mb-4">Request Follow</h2>
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
                                disabled={isLoading}
                                className={`px-6 py-2 rounded font-semibold ${
                                    isLoading
                                        ? 'bg-purple-700 cursor-not-allowed'
                                        : 'bg-purple-600 hover:bg-purple-700'
                                } text-white transition-colors`}
                            >
                                Request Follow
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
                                        disabled={isLoading}
                                        className={`px-4 py-2 rounded ${
                                            isLoading
                                                ? 'bg-green-700 cursor-not-allowed'
                                                : 'bg-green-600 hover:bg-green-700'
                                        } text-white transition-colors`}
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

export default VerifyFollows; 