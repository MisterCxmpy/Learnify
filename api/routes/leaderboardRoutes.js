const { Router } = require("express");

const leaderboardController = require('../controllers/leaderboardController');

const leaderboardRouter = Router();

leaderboardRouter.get("/", leaderboardController.index);
leaderboardRouter.get("/entry/:subject/:id", leaderboardController.show);
leaderboardRouter.get("/subject/:subject", leaderboardController.subject);
leaderboardRouter.post("/", leaderboardController.create);
leaderboardRouter.patch("/update/:subject/:id", leaderboardController.update);

module.exports = leaderboardRouter;