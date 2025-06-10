const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const otpGenerator = require('otp-generator');
const User = require('../models/User');
const OTP = require('../models/OTP');
const { sendOTPEmail } = require('../utils/emailService');
const rateLimit = require('express-rate-limit');

// Rate limiting for OTP requests - 3 attempts per 15 minutes
const otpLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 3,
    message: { message: 'Too many OTP requests. Please try again later.' }
});

// Test email route
router.post('/test-email', async (req, res) => {
    try {
        const testOTP = '123456';
        const emailSent = await sendOTPEmail(req.body.email, testOTP);
        if (emailSent) {
            res.json({ message: 'Test email sent successfully' });
        } else {
            res.status(500).json({ message: 'Failed to send test email' });
        }
    } catch (error) {
        console.error('Test email error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Request OTP
router.post('/request-otp', otpLimiter, async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate OTP
        const otp = otpGenerator.generate(6, {
            upperCase: false,
            specialChars: false,
            alphabets: false
        });

        // Save OTP to database
        await OTP.findOneAndDelete({ email }); // Delete any existing OTP
        await OTP.create({ email, otp });

        // Send OTP email
        const emailSent = await sendOTPEmail(email, otp);
        if (!emailSent) {
            return res.status(500).json({ message: 'Failed to send OTP email' });
        }

        res.json({ message: 'OTP sent successfully' });
    } catch (error) {
        console.error('OTP request error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Verify OTP and complete login
router.post('/verify-otp', async (req, res) => {
    try {
        const { email, password, otp } = req.body;

        // Find OTP in database
        const otpDoc = await OTP.findOne({ email, otp });
        if (!otpDoc) {
            return res.status(401).json({ message: 'Invalid or expired OTP' });
        }

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        // Delete used OTP
        await OTP.deleteOne({ _id: otpDoc._id });

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        console.error('OTP verification error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Register new user
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await User.create({
            username,
            email,
            password: hashedPassword
        });

        // Generate token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Verify token
router.get('/verify', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select('-password');
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ user });
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
});

module.exports = router; 