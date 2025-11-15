// --- SERVER ENTRY POINT ---
// Main file to initialize the Express server and link all components.
// To run this, you must install the 'express' and 'cors' packages: npm install express cors
const express = require('express');
const cors = require('cors'); 
const routes = require('./routes');

// --- Setup ---
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Allows the frontend (index.html) to fetch data from this server
app.use(express.json());

// --- Link Routes ---
// All requests starting with /api/leaderboard will be handled by leaderboardRoutes
app.use('/api', routes);

// Simple root route to confirm server is running
app.get('/', (req, res) => {
    res.send('Leaderboard API Server is running on port 3000.');
});

// --- Server Start ---
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    // run 'node server.js' and have MySQL running for the app to work
});

app.on('error', (err) => {
    if (err && err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use.`);
        // choose behavior: exit or try another port
        process.exit(1);
    } else {
        console.error('Server error:', err);
        process.exit(1);
    }
});