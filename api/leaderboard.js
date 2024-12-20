// /api/leaderboard.js
const fs = require('fs');
const path = require('path');

// Path to the leaderboard JSON file
const leaderboardFile = path.join(__dirname, '../leaderboard.json');

// This will be triggered on GET requests to fetch leaderboard data
module.exports = (req, res) => {
    if (req.method === 'GET') {
        if (fs.existsSync(leaderboardFile)) {
            const data = fs.readFileSync(leaderboardFile, 'utf-8');
            res.status(200).json(JSON.parse(data));
        } else {
            res.status(200).json([]);
        }
    } else if (req.method === 'POST') {
        const { name, score } = req.body;
        let leaderboard = [];

        if (fs.existsSync(leaderboardFile)) {
            leaderboard = JSON.parse(fs.readFileSync(leaderboardFile, 'utf-8'));
        }

        const existingUserIndex = leaderboard.findIndex(entry => entry.name === name);
        if (existingUserIndex !== -1) {
            leaderboard[existingUserIndex].score += 1;
        } else {
            leaderboard.push({ name, score });
        }

        fs.writeFileSync(leaderboardFile, JSON.stringify(leaderboard, null, 2));
        res.status(200).json({ message: 'Leaderboard updated successfully!' });
    }
};
