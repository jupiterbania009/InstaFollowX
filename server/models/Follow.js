const mongoose = require('mongoose');

const followSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    instagramUsername: {
        type: String,
        required: true
    },
    points: {
        type: Number,
        default: 0
    },
    followsGiven: [{
        targetUser: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        instagramUsername: String,
        timestamp: {
            type: Date,
            default: Date.now
        },
        verified: {
            type: Boolean,
            default: false
        }
    }],
    followsReceived: [{
        fromUser: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        instagramUsername: String,
        timestamp: {
            type: Date,
            default: Date.now
        },
        verified: {
            type: Boolean,
            default: false
        }
    }],
    queuePosition: {
        type: Number,
        default: 0
    },
    lastFollowGiven: {
        type: Date,
        default: null
    },
    lastFollowReceived: {
        type: Date,
        default: null
    }
});

// Update points when follows are verified
followSchema.methods.updatePoints = function() {
    const verifiedFollowsGiven = this.followsGiven.filter(f => f.verified).length;
    const verifiedFollowsReceived = this.followsReceived.filter(f => f.verified).length;
    this.points = verifiedFollowsGiven;
    return this.save();
};

module.exports = mongoose.model('Follow', followSchema); 