const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const db = require('../db');

// Use singleton pool
const pool = db.getPool();

/** Helper to hash passwords using SHA-256 */
function hashPassword(password) {
    return crypto.createHash('sha256').update(password, 'utf8').digest('hex');
}

/** Load JWT secret from environment */
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
}

/**
 * POST /api/auth/signup
 * Body: { username, password }
 */
router.post('/signup', async (req, res) => {
    const { username, password } = req.body || {};
    if (!username || !password) {
        return res.status(400).json({ error: 'username and password are required' });
    }

    try {
        // Check if username exists
        const [rows] = await pool.execute('SELECT id FROM Users WHERE Username = ?', [username]);
        if (rows.length > 0) {
            return res.status(409).json({ error: 'Username already exists' });
        }

        const id = crypto.randomUUID();
        const hashed = hashPassword(password);

        await pool.execute(
            'INSERT INTO Users (id, Username, Password, CareerWins, CareerLosses, Points) VALUES (?, ?, ?, 0, 0, 0)',
            [id, username, hashed]
        );

        return res.status(201).json({ id, username });
    } catch (err) {
        console.error('Signup error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * POST /api/auth/login
 * Body: { username, password }
 */
router.post('/login', async (req, res) => {
    const { username, password } = req.body || {};
    if (!username || !password) {
        return res.status(400).json({ error: 'username and password are required' });
    }

    try {
        const [rows] = await pool.execute(
            'SELECT id, Username, Password, CareerWins, CareerLosses, Points FROM Users WHERE Username = ?',
            [username]
        );

        if (rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = rows[0];
        const hashed = hashPassword(password);
        if (hashed !== user.Password) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Create JWT payload
        const payload = {
            id: user.id,
            username: user.Username,
        };

        // Sign JWT using secret from environment
        const token = jwt.sign(payload, JWT_SECRET, { algorithm: 'HS256' });

        return res.json({
            token, // JWT returned to client
            id: user.id,
            username: user.Username,
            careerWins: user.CareerWins,
            careerLosses: user.CareerLosses,
            points: user.Points,
        });
    } catch (err) {
        console.error('Login error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
