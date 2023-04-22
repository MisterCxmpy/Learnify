const flashcardRoute = require("./routes/flashcardRoutes");
const userRouter = require("./routes/userRoutes")
const express = require("express");
const cors = require("cors");
const quizRouter = require("./routes/quizRoutes");
const leaderboardRouter = require("./routes/leaderboardRoutes");


const api = express();

api.use(cors());
api.use(express.json())

api.use("/flashcards", flashcardRoute);
api.use("/users", userRouter)
api.use("/quiz", quizRouter)
api.use("/leaderboard", leaderboardRouter)

module.exports = api;