const Leaderboard = require("../models/Leaderboard.js");

async function index (req, res) {
    try {
        const leaderboard = await Leaderboard.getAll();
        res.status(200).json(leaderboard);
    } catch (err) {
        res.status(500).json({error : err.message });
    }
}

module.exports = { index }