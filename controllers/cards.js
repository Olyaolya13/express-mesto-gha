const { HTTP_STATUS_CREATED } = require('http2').constants;
const { HTTP_STATUS_NO_CONTENT } = require('http2').constants;
const Card = require('../models/card');

const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.status(HTTP_STATUS_CREATED).send({ data: cards }))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      Card.findById(card._id)
        .orFail()
        .populate('owner')
        .then((cards) => res.status(HTTP_STATUS_CREATED).send({ data: cards }))
        .catch((err) => {
          if (err.name === 'DocumentNotFoundError') {
            next(new NotFoundError('Карточка не найдена'));
          } else { next(err); }
        });
    }).catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(err.message));
      } else { next(err); }
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail()
    .then(() => res.status(HTTP_STATUS_NO_CONTENT).send())
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Некорректный _id карточки'));
      } else if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError('Карточка не найдена'));
      } else {
        next(err);
      }
    });
};

module.exports.cardLike = (req, res, next) => {
  const userId = req.user._id;

  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: userId } },
    { new: true },
  ).orFail()
    .populate(['owner', 'likes'])
    .then((card) => res.status(HTTP_STATUS_NO_CONTENT).send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Некорректный _id карточки'));
      } else if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError('Карточка не найдена'));
      } else {
        next(err);
      }
    });
};

module.exports.deleteCardLike = (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: userId } },
    { new: true },
  ).orFail()
    .populate(['owner', 'likes'])
    .then((card) => res.status(HTTP_STATUS_NO_CONTENT).send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Некорректный _id карточки'));
      } else if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError('Карточка не найдена'));
      } else {
        next(err);
      }
    });
};
