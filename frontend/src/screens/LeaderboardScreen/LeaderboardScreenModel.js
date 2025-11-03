// --- MODEL (M) ---
// This file handles all direct interaction with the MySQL database.
// To run this, you must install the 'mysql2' package: npm install mysql2
const mysql = require('mysql2/promise');

// IMPORTANT: Replace these with your actual database credentials.
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'your_mysql_password', // Change this!
    database: 'game_db', // Ensure this database and a 'leaderboard' table exist
};

/**
 * Creates a connection pool to the database.
 */
const pool = mysql.createPool(dbConfig);

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