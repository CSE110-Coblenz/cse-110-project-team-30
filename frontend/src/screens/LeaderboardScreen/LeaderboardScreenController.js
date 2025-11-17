// --- CONTROLLER (C) ---
// This file handles the logic for processing the request and generating the response.
const LeaderboardModel = require('../../../../backend-REST/routes/leaderboard');

/**
 * Controller function to fetch and send the leaderboard data.
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
async function getTopLeaderboard(req, res) {
    try {
        // 1. Call the model to fetch data from the database
        const data = await LeaderboardModel.getLeaderboardData();

        // 2. Prepare and send the successful JSON response
        res.status(200).json({
            success: true,
            message: 'Successfully retrieved top 10 leaderboard.',
            data: data
        });

    } catch (error) {
        // 3. Handle errors (e.g., database connection failure)
        console.error("Error in getTopLeaderboard controller:", error.message);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error: Could not process leaderboard request. Check your database connection and credentials.'
        });
    }
}

module.exports = {
    getTopLeaderboard,
};