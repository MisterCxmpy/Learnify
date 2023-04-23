const db = require("../config/postgresdb");

class Flashcard {
    constructor({
        card_id,
        collection,
        question,
        fact,
        user_id
    }) {
        this.card_id = card_id;
        this.collection = collection;
        this.question = question;
        this.fact = fact;
        this.user_id = user_id;
    }

    static async getAll() {
        const response = await db.query("SELECT * FROM flashcard;");
        if (response.rows.length === 0) {
            throw new Error ("No flashcards available");
        }
        return response.rows.map((f) => new Flashcard(f));
    }

    static async getById(id) {
        const response = await db.query("SELECT * FROM flashcard WHERE card_id = $1;", [id]);
        if (response.rows.length != 1) {
            throw new Error("No flashcards available");
        }
        return new Flashcard(response.rows[0]);
    }

    static async getByUserId(id) {
        const response = await db.query("SELECT * FROM flashcard where user_id = $1;",
        [id]
        )
        if (response.rows.length < 1) {
            throw new Error("No flashcards available")
        }
        return response.rows.map((a) => new Flashcard(a));
    }

    static async getBySubject(subject) {
        const response = await db.query("SELECT * FROM flashcard WHERE collection = $1", [subject]);
        if (response.rows.length === 0) {
            throw new Error("No flashcards available for this subject");
        }
        return response.rows.map((f) => new Flashcard(f));
    }

    static async getBySubjectAndUser(subject, id) {
        const response = await db.query("SELECT * FROM flashcard WHERE collection = $1 AND user_id = 1 or user_id = $2", [subject, id]);
        if (response.rows.length === 0) {
            throw new Error("No flashcards available for this subject");
        }
        return response.rows.map((f) => new Flashcard(f));
    }

    static async create(data) {
        const {collection, question, fact, user_id} = data;
        const response = await db.query(
            "INSERT INTO flashcard (collection, question, fact, user_id) VALUES ($1, $2, $3, $4) RETURNING *;",
            [collection, question, fact, user_id]
        );

        return response.rows[0];
    }

  async destroy() {
        await db.query("DELETE FROM flashcard WHERE card_id = $1 RETURNING *;", 
        [this.card_id]);
        return null;
    }

    static async getFavoritesByUser(id) {
        const query = `
          SELECT flashcard.*
          FROM flashcard
          INNER JOIN favorites ON favorites.card_id = flashcard.card_id
          WHERE favorites.user_id = $1;
        `;
        const response = await db.query(query, [id]);
        if (response.rows.length === 0) {
          throw new Error("No favorite flashcards found for this user");
        }
        return response.rows.map((f) => new Flashcard(f));
      }

       async addFavorite(userId, cardId) {
        try {
          const query = 'INSERT INTO favorites (user_id, card_id) VALUES ($1, $2)';
          await db.query(query, [userId, cardId]);
          return true;
        } catch (err) {
          console.error(err);
          return false;
        }      
    }

     async destroyFavorite(userId, cardId) {
        try {
          const query = 'DELETE FROM favorites WHERE user_id = $1 AND card_id = $2';
          await db.query(query, [userId, cardId]);
          return true;
        } catch (err) {
          console.error(err);
          return false;
        }
      }
}

module.exports = Flashcard;
