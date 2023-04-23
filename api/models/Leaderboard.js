const db = require("../config/postgresdb");

class Leaderboard {
  constructor({ Leaderboard_id, user_id, username, subject, score, accuracy, quiz_played }) {
    this.Leaderboard_id = Leaderboard_id;
    this.user_id = user_id;
    this.username = username;
    this.subject = subject;
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

  static async getById(id, subject) {
    const response = await db.query(
      "SELECT * FROM leaderboard WHERE user_id = $1 AND subject = $2;",
      [id, subject]
      );
    if (response.rows.length != 1) {
      throw new Error("User not found in leaderboard!");
    }
    return new Leaderboard(response.rows[0]);
  }

  static async getBySubject(subject) {
    const response = await db.query(
      "SELECT * FROM leaderboard WHERE subject = $1 ORDER BY score DESC;",
      [subject]
    );
    if (response.rows.length === 0) {
      throw new Error("Subject not found in leaderboard!");
    }
    return response.rows.map((f) => new Leaderboard(f));
  }
  
  static async create(data) {
    const { user_id, username, subject, score, accuracy, quiz_played } = data;

    const response = await db.query(
      "INSERT INTO leaderboard (user_id, username, subject, score, accuracy, quiz_played) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;",
      [user_id, username, subject, score, accuracy, quiz_played]
    );
    return response.rows[0];
  }

  async update(data) {
    const { subject, score, accuracy, quiz_played } = data;
    const response = await db.query(
      "UPDATE leaderboard SET subject = $1, score = $2, accuracy = $3, quiz_played = $4 WHERE user_id = $5 AND subject = $1 RETURNING *;",
      [subject, score, accuracy, quiz_played, this.user_id]
    );
    if (response.rows.length != 1) {
      throw new Error("Unable to update score");
    }
    return new Leaderboard(response.rows[0]);
  }
}

module.exports = Leaderboard;
