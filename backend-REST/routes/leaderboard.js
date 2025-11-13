// --- MODEL (M) ---
// This file handles all direct interaction with the MySQL database.
// To run this, you must install the 'mysql2' and 'dotenv' packages: npm install mysql2 dotenv

require('dotenv').config(); // Load environment variables from .env
const db = require('../db');

// Use singleton pool from backend-REST/db.js
const pool = db.getPool();

/**
 * Fetches the top 10 players from the 'leaderboard' table, ordered by points.
 * The 'leaderboard' table is expected to have 'username' (VARCHAR) and 'points' (INT) columns.
 * @returns {Promise<Array<{username: string, points: number}>>}
 */
async function getLeaderboardData() {
    const query = `
        SELECT username, points 
        FROM leaderboard 
        ORDER BY points DESC 
        LIMIT 10;
    `;

    try {
        // Execute the query. The result is an array of rows and field data.
        const [rows] = await pool.execute(query);
        console.log("Database query successful.");
        return rows;
    } catch (error) {
        console.error("Error executing MySQL query:", error);
        // Throw an error to be caught by the Controller
        throw new Error('Failed to retrieve leaderboard data from the database.');
    }
}

module.exports = {
    getLeaderboardData,
};
