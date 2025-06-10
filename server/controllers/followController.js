const Follow = require('../models/Follow');
const User = require('../models/User');
const crypto = require('crypto');

// Get users to follow
exports.getFollowQueue = async (req, res) => {
    try {
        // Get users that need to be followed, excluding the current user's follows
        const followQueue = await Follow.find({
            status: 'pending',
            follower: { $ne: req.user._id }
        })
        .populate('follower', 'username instagramUsername')
        .sort({ createdAt: 1 })
        .limit(10);

        res.json(followQueue);
    } catch (error) {
        console.error('Error getting follow queue:', error);
        res.status(500).json({ message: 'Error getting follow queue' });
    }
};

// Request to be followed
exports.requestFollow = async (req, res) => {
    try {
        const { instagramUsername } = req.body;

        if (!instagramUsername) {
            return res.status(400).json({ message: 'Instagram username is required' });
        }

        // Check if user has enough points
        const user = await User.findById(req.user._id);
        if (user.points < 1) {
            return res.status(400).json({ message: 'Not enough points' });
        }

        // Generate verification code
        const verificationCode = crypto.randomBytes(3).toString('hex');

        // Create new follow request
        const follow = new Follow({
            follower: req.user._id,
            targetUsername: instagramUsername,
            verificationCode,
            status: 'pending'
        });

        await follow.save();

        // Deduct points
        user.points -= 1;
        await user.save();

        res.json({ 
            message: 'Follow request created successfully',
            verificationCode 
        });
    } catch (error) {
        console.error('Error creating follow request:', error);
        res.status(500).json({ message: 'Error creating follow request' });
    }
};

// Verify follow
exports.verifyFollow = async (req, res) => {
    try {
        const { followId, verificationCode } = req.body;

        const follow = await Follow.findById(followId);
        if (!follow) {
            return res.status(404).json({ message: 'Follow request not found' });
        }

        if (follow.verificationCode !== verificationCode) {
            return res.status(400).json({ message: 'Invalid verification code' });
        }

        // Update follow status
        follow.status = 'verified';
        await follow.save();

        // Add points to the follower
        const follower = await User.findById(follow.follower);
        follower.points += 2; // Give 2 points for completing a follow
        await follower.save();

        res.json({ message: 'Follow verified successfully' });
    } catch (error) {
        console.error('Error verifying follow:', error);
        res.status(500).json({ message: 'Error verifying follow' });
    }
};

// Get user's follow history
exports.getFollowHistory = async (req, res) => {
    try {
        const follows = await Follow.find({
            $or: [
                { follower: req.user._id },
                { targetUsername: req.user.instagramUsername }
            ]
        })
        .populate('follower', 'username instagramUsername')
        .sort({ createdAt: -1 });

        res.json(follows);
    } catch (error) {
        console.error('Error getting follow history:', error);
        res.status(500).json({ message: 'Error getting follow history' });
    }
};

// Get user's stats
exports.getStats = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        
        const stats = {
            points: user.points,
            followsGiven: await Follow.countDocuments({ 
                follower: req.user._id,
                status: 'verified'
            }),
            followsReceived: await Follow.countDocuments({ 
                targetUsername: user.instagramUsername,
                status: 'verified'
            }),
            pendingFollows: await Follow.countDocuments({ 
                follower: req.user._id,
                status: 'pending'
            })
        };

        res.json(stats);
    } catch (error) {
        console.error('Error getting stats:', error);
        res.status(500).json({ message: 'Error getting stats' });
    }
}; 