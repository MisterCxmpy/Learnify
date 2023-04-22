const db = require("../config/postgresdb");

class Leaderboard {
  constructor({ Leaderboard_id, user_id, score, accuracy, quiz_played }) {
    this.Leaderboard_id = Leaderboard_id;
    this.user_id = user_id;
    this.score = score;
    this.accuracy = accuracy;
    this.quiz_played = quiz_played;
  }

  static async getAll() {
    const response = await db.query("SELECT * FROM leaderboard;");
    if (response.rows.length === 0) {
      throw new Error("No leaderboard data available!");
    }
    return response.rows.map((f) => new Leaderboard(f));
  }

  static async getById(id) {
    const response = await db.query("SELECT * FROM leaderboard WHERE user_id = $1;", [id]);
    if (response.rows.length != 1) {
        throw new Error("User not found in leaderboard!");
    }
    return new Leaderboard(response.rows[0]);
  }

}

module.exports = Leaderboard;
