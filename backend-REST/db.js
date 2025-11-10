require('dotenv').config();
const mysql = require('mysql2/promise');

const dbConfig = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
};

let pool = null;

/**
 * Returns a single shared MySQL pool instance (singleton).
 * Creates the pool on first call and reuses it thereafter.
 */
function getPool() {
    if (!pool) {
        pool = mysql.createPool(dbConfig);
        console.log('Created MySQL pool (singleton).');
    }
    return pool;
}

module.exports = { getPool };
