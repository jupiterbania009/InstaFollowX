const mongoose = require('mongoose');

const followSchema = new mongoose.Schema({
    follower: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    following: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    },
    verificationCode: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        default: null
    },
    followedBack: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 7 * 24 * 60 * 60 // Automatically delete after 7 days if not verified
    },
    completedAt: {
        type: Date,
        default: null
    }
});

// Prevent duplicate follows
followSchema.index({ follower: 1, following: 1 }, { unique: true });

// For efficient querying of pending follows
followSchema.index({ status: 1, createdAt: -1 });

// Prevent self-follows
followSchema.pre('save', function(next) {
    if (this.follower.equals(this.following)) {
        next(new Error('Cannot follow yourself'));
    }
    next();
});

// Generate random verification code
followSchema.pre('save', function(next) {
    if (this.isNew) {
        this.verificationCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    }
    next();
});

module.exports = mongoose.model('Follow', followSchema); 
