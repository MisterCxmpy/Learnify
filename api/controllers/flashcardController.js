const Flashcard = require("../models/Flashcard.js");
const User = require('../models/User.js')

async function index (req, res) {
    try {
        const flashcards = await Flashcard.getAll();
        res.status(200).json(flashcards);
    } catch (err) {
        res.status(500).json({error : err.message });
    }
}

async function show(req, res) {
    try {
        const id = parseInt(req.params.id) 
        const flashcard = await Flashcard.getById(id);
        if (!flashcard) {
            throw new Error('Flashcard not found');
        }
        res.status(200).json(flashcard);
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
}


async function create(req, res) {
    const data = req.body;
    const user_id = req.user_id;
  
    if (!data.question || !data.collection) {
      res.status(400).json({ error: 'Flashcard creation failed: Failed to create flashcard' });
    } else {
      try {
        const flashcard = await Flashcard.create(data);
        res.status(201).json(flashcard);
      } catch (err) {
        const errorMessage = `Flashcard creation failed: ${err.message}`;
        res.status(404).json({ error: errorMessage });
      }
    }
  }
  

async function destroy(req, res) {
    try {
        const id = parseInt(req.params.id);
        const flashcard = await Flashcard.getById(id);
        const result = await flashcard.destroy();
        res.status(204).json(result);
    } catch (err) {
        res.status(404).json({ error: err.message })
    }
}

async function getByUserId(req, res) {
    try {
        const id = parseInt(req.params.id);
        const flashcards = await Flashcard.getByUserId(id);
        res.status(200).json(flashcards);
    }  catch(err) {
        res.status(500).json({ error: err.message });
    }
}

async function getBySubject(req, res) {
    try {
      const subject = req.params.subject;
      const flashcards = await Flashcard.getBySubject(subject);
      if (flashcards.length === 0) {
        return res.status(404).json({ error: `No flashcards found with the subject: ${subject}` });
      }
      res.status(200).json(flashcards);
    } catch (err) {
      res.status(404).json({ error: err.message });
    }
  }

async function getBySubjectAndUser(req, res) {
    try {
      const subject = req.params.subject;
      const id = req.params.id;
      const flashcards = await Flashcard.getBySubjectAndUser(subject, id);
      if (flashcards.length === 0) {
        return res.status(404).json({ error: `No flashcards found with the subject: ${subject}` });
      }
      res.status(200).json(flashcards);
    } catch (err) {
      res.status(404).json({ error: err.message });
    }
  }

  
  async function addFavorite(req, res) {
    try {
      const userId = req.params.userId;
      const cardId = req.params.cardId;
      const user = await User.getOneById(userId);
      const flashcard = await Flashcard.getById(cardId);
  
      if (!flashcard) {
        return res.status(404).json({ error: 'Flashcard not found' });
      }
  
      await flashcard.addFavorite(userId, cardId);
      res.status(200).json({ message: 'Flashcard added to favorites' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async function deleteFavorite(req, res) {
    try {
      const userId = req.params.userId;
      const cardId = req.params.cardId;
      const user = await User.getOneById(userId);
      const flashcard = await Flashcard.getById(cardId);

      if (!flashcard) {
        return res.status(404).json({ error: 'Flashcard not found' });
      }
      

      const success = await flashcard.destroyFavorite(userId, cardId);

      if (success) {
        res.status(200).json({ message: 'Flashcard removed from favorites' });
      } else {
        res.status(500).json({ error: 'Failed to remove flashcard from favorites' });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
  

  async function getFavoritesByUserId(req, res) {
    try {
      const id = parseInt(req.params.id);

      const favorites = await Flashcard.getFavoritesByUser(id);
    
      if (favorites.length === 0) {
        return res.status(404).json({ error: 'No favorites found for this user' });
      }
    
      res.status(200).json(favorites);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
  
  
  

module.exports = { index, show, create, destroy, getByUserId, getBySubject, getBySubjectAndUser, addFavorite, getFavoritesByUserId, deleteFavorite}