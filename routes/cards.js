const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getCards, createCard, deleteCard, cardLike, deleteCardLike,
} = require('../controllers/cards');

router.get('/', getCards);

router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    link: Joi.string().pattern(/^(https?:\/\/)?[^\s/$.?#].[^\s]*$/),
  }),
}), createCard);
router.delete('/:cardId', celebrate({
  body: Joi.object().keys({
    params: Joi.object().keys({
      cardId: Joi.string().alphanum().length(24).required(),
    }),
  }),
}), deleteCard);
router.put('/:cardId/likes', celebrate({
  body: Joi.object().keys({
    params: Joi.object().keys({
      cardId: Joi.string().alphanum().length(24).required(),
    }),
  }),
}), cardLike);
router.delete('/:cardId/likes', celebrate({
  body: Joi.object().keys({
    params: Joi.object().keys({
      cardId: Joi.string().alphanum().length(24).required(),
    }),
  }),
}), deleteCardLike);

module.exports = router;
