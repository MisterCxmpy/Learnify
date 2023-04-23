const { Router } = require("express");

const flashCardController = require('../controllers/flashcardController');
const authenticator = require('../middleware/authenticator');

const flashcardRouter = Router();

flashcardRouter.get("/", flashCardController.index);
flashcardRouter.get("/:subject", flashCardController.getBySubject);
flashcardRouter.get("/:subject/:id", flashCardController.getBySubjectAndUser);
flashcardRouter.get("/single/:id", flashCardController.show);
flashcardRouter.get("/user/:id", flashCardController.getByUserId);
flashcardRouter.post("/", flashCardController.create);
flashcardRouter.delete("/:id", flashCardController.destroy);
flashcardRouter.post("/favorite/user/:userId/card/:cardId", flashCardController.addFavorite);
flashcardRouter.get("/favorite/user/:id", flashCardController.getFavoritesByUserId);
flashcardRouter.delete("/favorite/user/:userId/card/:cardId", flashCardController.deleteFavorite);



module.exports = flashcardRouter;