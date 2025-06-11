const mongoose = require('mongoose');

const followSchema = new mongoose.Schema({
    follower: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    targetUsername: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'verified', 'failed'],
        default: 'pending'
    },
    points: {
        type: Number,
        default: 1
    },
    verificationCode: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 86400 // Document will be automatically deleted after 24 hours if not verified
    }
});

// Index for efficient queries
followSchema.index({ follower: 1, status: 1 });
followSchema.index({ targetUsername: 1, status: 1 });

// Update points when follows are verified
followSchema.methods.updatePoints = function() {
    const verifiedFollowsGiven = this.followsGiven.filter(f => f.verified).length;
    const verifiedFollowsReceived = this.followsReceived.filter(f => f.verified).length;
    this.points = verifiedFollowsGiven;
    return this.save();
};

module.exports = mongoose.model('Follow', followSchema); 