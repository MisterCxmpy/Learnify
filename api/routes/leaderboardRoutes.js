const { Router } = require("express");

const leaderboardController = require('../controllers/leaderboardController');

const leaderboardRouter = Router();

leaderboardRouter.get("/", leaderboardController.index);



module.exports = leaderboardRouter;