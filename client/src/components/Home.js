import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="max-w-4xl mx-auto text-center py-16">
            <h1 className="text-5xl font-bold text-white mb-8">
                Grow Your Instagram Following
            </h1>
            
            <p className="text-xl text-gray-300 mb-12">
                Exchange follows with real users and grow your Instagram presence. 
                Earn points for following others and get followers in return!
            </p>

            <div className="space-y-4">
                <button
                    onClick={() => navigate('/login')}
                    className="px-8 py-4 bg-purple-600 text-white rounded-lg text-xl font-semibold hover:bg-purple-700 transition-colors"
                >
                    Get Started Now
                </button>
            </div>

            <div className="mt-4">
                <p className="text-gray-400">
                    Already have an account?{' '}
                    <button
                        onClick={() => navigate('/login')}
                        className="text-purple-500 hover:text-purple-400 font-medium"
                    >
                        Login here
                    </button>
                </p>
            </div>
            
            <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-gray-800 p-6 rounded-lg">
                    <h3 className="text-xl font-bold text-white mb-4">
                        Follow Exchange
                    </h3>
                    <p className="text-gray-300">
                        Exchange follows with other Instagram users to grow your audience organically.
                    </p>
                </div>
                
                <div className="bg-gray-800 p-6 rounded-lg">
                    <h3 className="text-xl font-bold text-white mb-4">
                        Real Engagement
                    </h3>
                    <p className="text-gray-300">
                        Connect with real users who are interested in similar content.
                    </p>
                </div>
                
                <div className="bg-gray-800 p-6 rounded-lg">
                    <h3 className="text-xl font-bold text-white mb-4">
                        Track Progress
                    </h3>
                    <p className="text-gray-300">
                        Monitor your growth and manage your follow exchanges in one place.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Home; 
