// --- ROUTES (V) ---
// This file maps API endpoints to Controller/Model functions.
const express = require('express');
const router = express.Router();

// Models / sub-routers
const leaderboardModel = require('./routes/leaderboard');
const authRoutes = require('./routes/auth');

// GET /api/leaderboard - return top leaderboard entries
router.get('/leaderboard', async (req, res) => {
	try {
		const rows = await leaderboardModel.getLeaderboardData();
		return res.json(rows);
	} catch (err) {
		console.error('Error fetching leaderboard:', err);
		return res.status(500).json({ error: 'Failed to fetch leaderboard' });
	}
});

// Mount auth routes at /api/auth
router.use('/auth', authRoutes);

module.exports = router;