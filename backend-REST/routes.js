// --- ROUTES (V) ---
// This file maps API endpoints to Controller/Model functions.
const express = require('express');
const router = express.Router();

// Models / sub-routers
const leaderboardModel = require('./routes/leaderboard');
const authRoutes = require('./routes/auth');
const userModel = require('./routes/user');

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

// POST /api/user/points/update - Update user points (add/subtract)
// Body: { username, pointsChange }
router.post('/user/points/update', async (req, res) => {
    try {
        // [修改] 改为接收 username
        const { username, pointsChange } = req.body; 
        
        if (!username || pointsChange === undefined) {
            return res.status(400).json({ error: 'username and pointsChange are required' });
        }

        if (typeof pointsChange !== 'number') {
            return res.status(400).json({ error: 'pointsChange must be a number' });
        }

        // [修改] 调用 Model 时传入 username
        const result = await userModel.updateUserPoints(username, pointsChange);
        return res.json(result);
    } catch (err) {
        console.error('Error updating user points:', err);
        return res.status(500).json({ error: err.message || 'Failed to update user points' });
    }
});

// PUT /api/user/points - Set user points to a specific value
// Body: { username, points }
router.put('/user/points', async (req, res) => {
    try {
        // [修改] 改为接收 username
        const { username, points } = req.body; 
        
        if (!username || points === undefined) {
            return res.status(400).json({ error: 'username and points are required' });
        }

        if (typeof points !== 'number') {
            return res.status(400).json({ error: 'points must be a number' });
        }

        // [修改] 调用 Model 时传入 username
        const result = await userModel.setUserPoints(username, points);
        return res.json(result);
    } catch (err) {
        console.error('Error setting user points:', err);
        return res.status(500).json({ error: err.message || 'Failed to set user points' });
    }
});

// GET /api/user/points/:username - Get current user points
// [修改] 路由参数改为 :username
router.get('/user/points/:username', async (req, res) => {
    try {
        // [修改] 从 params 获取 username
        const { username } = req.params; 
        
        if (!username) {
            return res.status(400).json({ error: 'username is required' });
        }

        // [修改] 调用 Model 时传入 username
        const result = await userModel.getUserPoints(username);
        return res.json(result);
    } catch (err) {
        console.error('Error getting user points:', err);
        return res.status(500).json({ error: err.message || 'Failed to get user points' });
    }
});

// Mount auth routes at /api/auth
router.use('/auth', authRoutes);

module.exports = router;