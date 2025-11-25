// --- MODEL (M) ---
// This file handles user-related database operations.
const db = require('../db');

// Use singleton pool
const pool = db.getPool();

/**
 * Updates user points in the database using Username
 * @param {string} username - Username
 * @param {number} pointsChange - Points to add (can be negative)
 * @returns {Promise<{points: number}>} Updated points value
 */
async function updateUserPoints(username, pointsChange) {
    try {
        // 1. 根据 Username 获取当前分数
        const [currentRows] = await pool.execute(
            'SELECT Points FROM Users WHERE Username = ?',
            [username]
        );

        if (currentRows.length === 0) {
            throw new Error('User not found');
        }

        const currentPoints = currentRows[0].Points;
        const newPoints = Math.max(0, currentPoints + pointsChange); // Ensure points don't go below 0

        // 2. 根据 Username 更新分数
        await pool.execute(
            'UPDATE Users SET Points = ? WHERE Username = ?',
            [newPoints, username]
        );

        return { points: newPoints };
    } catch (error) {
        console.error('Error updating user points:', error);
        throw new Error('Failed to update user points');
    }
}

/**
 * Sets user points to a specific value using Username
 * @param {string} username - Username
 * @param {number} points - New points value
 * @returns {Promise<{points: number}>} Updated points value
 */
async function setUserPoints(username, points) {
    try {
        const finalPoints = Math.max(0, points);

        await pool.execute(
            'UPDATE Users SET Points = ? WHERE Username = ?',
            [finalPoints, username]
        );

        return { points: finalPoints };
    } catch (error) {
        console.error('Error setting user points:', error);
        throw new Error('Failed to set user points');
    }
}

/**
 * Gets current user points using Username
 * @param {string} username - Username
 * @returns {Promise<{points: number}>} Current points value
 */
async function getUserPoints(username) {
    try {
        const [rows] = await pool.execute(
            'SELECT Points FROM Users WHERE Username = ?',
            [username]
        );

        if (rows.length === 0) {
            throw new Error('User not found');
        }

        return { points: rows[0].Points };
    } catch (error) {
        console.error('Error getting user points:', error);
        throw new Error('Failed to get user points');
    }
}

module.exports = {
    updateUserPoints,
    setUserPoints,
    getUserPoints,
};