const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    instagramUsername: {
        type: String,
        trim: true
    },
    points: {
        type: Number,
        default: 5  // Start with 5 bonus points
    },
    followersCount: {
        type: Number,
        default: 0
    },
    followingCount: {
        type: Number,
        default: 0
    },
    rating: {
        average: {
            type: Number,
            default: 5.0
        },
        count: {
            type: Number,
            default: 0
        }
    },
    followBackRate: {
        type: Number,
        default: 100  // Percentage
    },
    lastActive: {
        type: Date,
        default: Date.now
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    rank: {
        type: Number,
        default: 0
    }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to check password
userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Method to add points
userSchema.methods.addPoints = async function(amount) {
    this.points += amount;
    await this.save();
    return this.points;
};

// Method to deduct points
userSchema.methods.deductPoints = async function(amount) {
    if (this.points < amount) {
        throw new Error('Insufficient points');
    }
    this.points -= amount;
    await this.save();
    return this.points;
};

// Method to check if user has enough points
userSchema.methods.hasEnoughPoints = function(amount) {
    return this.points >= amount;
};

// Method to update follow counts
userSchema.methods.updateFollowCounts = async function(followingDelta, followersDelta) {
    this.followingCount += followingDelta;
    this.followersCount += followersDelta;
    await this.save();
};

// Method to update rating
userSchema.methods.updateRating = async function(newRating) {
    const oldTotal = this.rating.average * this.rating.count;
    this.rating.count += 1;
    this.rating.average = (oldTotal + newRating) / this.rating.count;
    await this.save();
};

// Method to update follow back rate
userSchema.methods.updateFollowBackRate = async function(didFollowBack) {
    const weight = 0.7; // Weight for new data vs historical
    this.followBackRate = (this.followBackRate * (1 - weight)) + (didFollowBack ? 100 : 0) * weight;
    await this.save();
};

// Method to update last active timestamp
userSchema.methods.touch = async function() {
    this.lastActive = new Date();
    await this.save();
};

// Indexes for efficient querying
userSchema.index({ points: -1 }); // For leaderboard
userSchema.index({ rating: -1 }); // For user discovery
userSchema.index({ lastActive: -1 }); // For active users
userSchema.index({ followBackRate: -1 }); // For reliable users

module.exports = mongoose.model('User', userSchema); 
