// --- ROUTES (V) ---
// This file maps API endpoints to the Controller functions.
const express = require('express');
const router = express.Router();
const LeaderboardController = require('./LeaderboardScreenController');

/**
 * @route GET /api/leaderboard/
 * @description Fetches the top players from the leaderboard using the Controller.
 * @access Public
 */
router.get('/', LeaderboardController.getTopLeaderboard);

module.exports = router;