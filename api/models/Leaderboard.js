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
    const response = await db.query(
      "SELECT * FROM leaderboard ORDER BY score DESC;"
    );
    if (response.rows.length === 0) {
      throw new Error("No leaderboard data available!");
    }
    return response.rows.map((f) => new Leaderboard(f));
  }

  static async getById(id) {
    const response = await db.query(
      "SELECT * FROM leaderboard WHERE user_id = $1;",
      [id]
    );
    if (response.rows.length != 1) {
      throw new Error("User not found in leaderboard!");
    }
    return new Leaderboard(response.rows[0]);
  }

  static async create(data) {
    const { id } = data;
    const response = await db.query(
      "INSERT INTO leaderboard (user_id, score, accuracy, quiz_played) VALUES ($1, $2, $3, $4) RETURNING *;",
      [id, 0, 0, 0]
    );

    return response.rows[0];
  }

  async update(data) {
    const { score, accuracy, quiz_played } = data;
    console.log(data)
    const response = await db.query(
      "UPDATE leaderboard SET score = $1, accuracy = $2, quiz_played = $3 WHERE user_id = $4 RETURNING *;",
      [this.score + score, accuracy, quiz_played, this.user_id]
    );
    if (response.rows.length != 1) {
      throw new Error("Unable to update score");
    }
    return new Leaderboard(response.rows[0]);
  }
}

module.exports = Leaderboard;
