const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Trust proxy - required for rate limiting behind reverse proxies (like on Render)
app.set('trust proxy', 1);

// Middleware
app.use(cors());
app.use(express.json());

// Health Check Endpoint
app.get('/health', (req, res) => {
    const healthcheck = {
        uptime: process.uptime(),
        message: 'OK',
        timestamp: Date.now(),
        mongoConnection: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    };
    try {
        res.send(healthcheck);
    } catch (error) {
        healthcheck.message = error;
        res.status(503).send();
    }
});

// Verify required environment variables
const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET', 'EMAIL_USER', 'EMAIL_PASSWORD'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
    console.error('Missing required environment variables:', missingEnvVars);
    process.exit(1);
}

// Connect to MongoDB with retry logic
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000,
            connectTimeoutMS: 10000
        });
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('MongoDB connection error:', err);
        // Retry connection after 5 seconds
        setTimeout(connectDB, 5000);
    }
};

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/follow', require('./routes/follow'));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: 'Something broke!',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
});

// Rate limiting for all routes
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false
});
app.use(limiter);

// Serve static files from the client directory
app.use(express.static(path.join(__dirname, '../client')));

// Serve index.html for all other routes (for client-side routing)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/index.html'));
});

const PORT = process.env.PORT || 10000;
let server;

const startServer = () => {
    server = app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
        console.log('Environment:', process.env.NODE_ENV);
        console.log('Email configured for:', process.env.EMAIL_USER);
    });
};

// Start server after MongoDB connects
mongoose.connection.once('connected', () => {
    startServer();
});

// Graceful shutdown
const shutdown = async () => {
    console.log('Shutting down gracefully...');
    if (server) {
        server.close();
    }
    try {
        await mongoose.connection.close();
        console.log('MongoDB connection closed');
        process.exit(0);
    } catch (err) {
        console.error('Error during shutdown:', err);
        process.exit(1);
    }
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

// Handle uncaught exceptions
process.on('uncaughtException', async (err) => {
    console.error('Uncaught Exception:', err);
    await shutdown();
});
