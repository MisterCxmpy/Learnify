const { Router } = require("express");

const leaderboardController = require('../controllers/leaderboardController');

const leaderboardRouter = Router();

leaderboardRouter.get("/", leaderboardController.index);
leaderboardRouter.get("/:id", leaderboardController.show);
leaderboardRouter.post("/", leaderboardController.create);
leaderboardRouter.patch("/update/:id", leaderboardController.update);

module.exports = leaderboardRouter;