const db = require("../config/postgresdb");

class Leaderboard {
  constructor({ Leaderboard_id, user_id, score }) {
    this.Leaderboard_id = Leaderboard_id;
    this.user_id = user_id;
    this.score = score;
  }

  static async getAll() {
    const response = await db.query("SELECT * FROM leaderboard;");
    if (response.rows.length === 0) {
      throw new Error("No leaderboard data available!");
    }
    return response.rows.map((f) => new Leaderboard(f));
  }
}

module.exports = Leaderboard;
