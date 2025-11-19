// --- MODEL (M) ---
// This file handles all direct interaction with the MySQL database.
// To run this, you must install the 'mysql2' and 'dotenv' packages: npm install mysql2 dotenv

require('dotenv').config(); // Load environment variables from .env
const db = require('../db');

// Use singleton pool from backend-REST/db.js
const pool = db.getPool();

/**
 * Fetches all players from the 'Users' table, ordered by Points (highest first).
 * Returns username and Points for each user.
 * @returns {Promise<Array<{username: string, points: number}>>}
 */
async function getLeaderboardData() {
    const query = `
        SELECT Username as username, Points as points 
        FROM Users 
        ORDER BY Points DESC;
    `;

    try {
        // Execute the query. The result is an array of rows and field data.
        const [rows] = await pool.execute(query);
        console.log("Database query successful. Retrieved", rows.length, "players.");
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
