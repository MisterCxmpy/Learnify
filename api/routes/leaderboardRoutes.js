const { Router } = require("express");

const leaderboardController = require('../controllers/leaderboardController');

const leaderboardRouter = Router();

leaderboardRouter.get("/", leaderboardController.index);
leaderboardRouter.get("/:id", leaderboardController.show);



module.exports = leaderboardRouter;