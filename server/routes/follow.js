const express = require('express');
const router = express.Router();
const Follow = require('../models/Follow');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }
        req.user = user;
        next();
    });
};

// Initialize or get user's follow profile
router.post('/init', authenticateToken, async (req, res) => {
    try {
        const { instagramUsername } = req.body;

        if (!instagramUsername) {
            return res.status(400).json({ message: 'Instagram username is required' });
        }

        let followProfile = await Follow.findOne({ userId: req.user.userId });

        if (!followProfile) {
            followProfile = await Follow.create({
                userId: req.user.userId,
                instagramUsername,
                points: 0
            });
        }

        res.json(followProfile);
    } catch (error) {
        console.error('Follow profile initialization error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get users to follow
router.get('/queue', authenticateToken, async (req, res) => {
    try {
        const currentUser = await Follow.findOne({ userId: req.user.userId });
        
        if (!currentUser) {
            return res.status(404).json({ message: 'Follow profile not found' });
        }

        // Get users who haven't been followed by current user
        const usersToFollow = await Follow.find({
            userId: { $ne: req.user.userId },
            'followsReceived.fromUser': { $ne: req.user.userId }
        })
        .sort({ points: -1 })
        .limit(10)
        .populate('userId', 'username');

        res.json(usersToFollow);
    } catch (error) {
        console.error('Queue fetch error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Record a follow
router.post('/record', authenticateToken, async (req, res) => {
    try {
        const { targetUserId, targetInstagramUsername } = req.body;

        if (!targetUserId || !targetInstagramUsername) {
            return res.status(400).json({ message: 'Target user information is required' });
        }

        const currentUser = await Follow.findOne({ userId: req.user.userId });
        const targetUser = await Follow.findOne({ userId: targetUserId });

        if (!currentUser || !targetUser) {
            return res.status(404).json({ message: 'User profile not found' });
        }

        // Record the follow
        currentUser.followsGiven.push({
            targetUser: targetUserId,
            instagramUsername: targetInstagramUsername,
            timestamp: new Date(),
            verified: false
        });

        targetUser.followsReceived.push({
            fromUser: req.user.userId,
            instagramUsername: currentUser.instagramUsername,
            timestamp: new Date(),
            verified: false
        });

        await currentUser.save();
        await targetUser.save();

        res.json({ message: 'Follow recorded successfully' });
    } catch (error) {
        console.error('Follow recording error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Verify a follow
router.post('/verify', authenticateToken, async (req, res) => {
    try {
        const { followId } = req.body;

        const userProfile = await Follow.findOne({ userId: req.user.userId });
        
        if (!userProfile) {
            return res.status(404).json({ message: 'User profile not found' });
        }

        const follow = userProfile.followsReceived.id(followId);
        
        if (!follow) {
            return res.status(404).json({ message: 'Follow not found' });
        }

        follow.verified = true;
        await userProfile.save();
        await userProfile.updatePoints();

        res.json({ message: 'Follow verified successfully' });
    } catch (error) {
        console.error('Follow verification error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get user's follow statistics
router.get('/stats', authenticateToken, async (req, res) => {
    try {
        const userProfile = await Follow.findOne({ userId: req.user.userId });
        
        if (!userProfile) {
            return res.status(404).json({ message: 'User profile not found' });
        }

        const stats = {
            points: userProfile.points,
            followsGiven: userProfile.followsGiven.length,
            followsReceived: userProfile.followsReceived.length,
            verifiedFollowsGiven: userProfile.followsGiven.filter(f => f.verified).length,
            verifiedFollowsReceived: userProfile.followsReceived.filter(f => f.verified).length,
            queuePosition: userProfile.queuePosition
        };

        res.json(stats);
    } catch (error) {
        console.error('Stats fetch error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router; 