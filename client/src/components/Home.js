import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = ({ isAuthenticated }) => {
    const navigate = useNavigate();

    const handleGetStarted = () => {
        if (isAuthenticated) {
            navigate('/dashboard');
        } else {
            navigate('/login');
        }
    };

    return (
        <div className="max-w-4xl mx-auto text-center py-16">
            <h1 className="text-5xl font-bold text-gray-900 mb-8">
                Welcome to InstaFollowX
            </h1>
            <p className="text-xl text-gray-600 mb-12">
                Grow your Instagram following organically through our follow exchange platform.
                Connect with real users and expand your reach!
            </p>
            <div className="space-y-4">
                <button
                    onClick={handleGetStarted}
                    className="px-8 py-4 bg-purple-600 text-white rounded-lg text-xl font-semibold hover:bg-purple-700 transition-colors"
                >
                    {isAuthenticated ? 'Go to Dashboard' : 'Get Started'}
                </button>
                {!isAuthenticated && (
                    <p className="text-gray-500">
                        Already have an account?{' '}
                        <button
                            onClick={() => navigate('/login')}
                            className="text-purple-600 hover:text-purple-700 font-semibold"
                        >
                            Login here
                        </button>
                    </p>
                )}
            </div>
            
            <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="p-6 bg-white rounded-lg shadow-lg">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                        Follow Exchange
                    </h3>
                    <p className="text-gray-600">
                        Exchange follows with other Instagram users to grow your audience organically.
                    </p>
                </div>
                <div className="p-6 bg-white rounded-lg shadow-lg">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                        Real Engagement
                    </h3>
                    <p className="text-gray-600">
                        Connect with real users who are interested in similar content.
                    </p>
                </div>
                <div className="p-6 bg-white rounded-lg shadow-lg">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                        Track Progress
                    </h3>
                    <p className="text-gray-600">
                        Monitor your growth and manage your follow exchanges in one place.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Home; 