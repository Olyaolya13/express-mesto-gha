const router = require('express').Router();
const { getCards, createCard, deleteCard } = require('../controllers/cards');

router.get('/', getCards);
router.post('/', createCard);
router.delete('/:cardId', deleteCard);
// router.put('/cards/:cardId/likes', putCardsLikes);
// router.delete('/:cardId/likes', deleteputCardsLikes);

module.exports = router;
