const Leaderboard = require("../models/Leaderboard.js");

async function index (req, res) {
    try {
        const leaderboard = await Leaderboard.getAll();
        res.status(200).json(leaderboard);
    } catch (err) {
        res.status(500).json({error : err.message });
    }
}

async function show(req, res) {
  try {
      const id = parseInt(req.params.id) 
      const leaderboard = await Leaderboard.getById(id);
      if (!leaderboard) {
          throw new Error('User not found in leaderboard');
      }
      res.status(200).json(leaderboard);
  } catch (err) {
      res.status(404).json({ error: err.message });
  }
}

async function create(req, res) {
  const data = req.body;

  try {
    const leaderboard = await Leaderboard.create(data);
    res.status(201).json(leaderboard);
  } catch (err) {
    const errorMessage = `Leaderboard entry failed: ${err.message}`;
    res.status(404).json({ error: errorMessage });
  }
}

const update = async (req, res) => {
  const data = req.body
  const id = parseInt(req.params.id)
  
  try {
    const entry = await Leaderboard.getById(id)
    const updatedEntry = await entry.update(data)
    res.status(200).json(updatedEntry)
  } catch(err) {
    res.status(404).json({ error: err.message })
  }
}

module.exports = { index, show, create, update }