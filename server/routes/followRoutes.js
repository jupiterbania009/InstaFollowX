const express = require('express');
const router = express.Router();
const followController = require('../controllers/followController');
const { protect } = require('../middleware/authMiddleware');

// All routes are protected and require authentication
router.use(protect);

// Get follow queue
router.get('/queue', followController.getFollowQueue);

// Request to be followed
router.post('/request', followController.requestFollow);

// Verify follow
router.post('/verify', followController.verifyFollow);

// Get follow history
router.get('/history', followController.getFollowHistory);

// Get user stats
router.get('/stats', followController.getStats);

module.exports = router; 