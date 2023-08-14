const router = require('express').Router();
const {
  getCards, createCard, deleteCard, cardLike, deleteCardLike,
} = require('../controllers/cards');

router.get('/', getCards);
router.post('/', createCard);
router.delete('/:cardId', deleteCard);
router.put('/:cardId/likes', cardLike);
router.delete('/:cardId/likes', deleteCardLike);

module.exports = router;
