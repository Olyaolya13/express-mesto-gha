const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => {
      res.send({ data: cards });
    })
    .catch(() => {
      res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      Card.findById(card._id)
        .populate('owner')
        .then((data) => res.send(data))
        .catch(() => res.status(404).send({ message: 'Карточка не найдена' }));
    }).catch((err) => {
      if (err.name === 'ValidationError') { res.status(400).send({ message: err.message }); } else { res.status(500).send({ message: 'На сервере произошла ошибка' }); }
    });
};

module.exports.deleteCard = (req, res) => {
  if (req.params.cardId.length !== 24) {
    res.status(400).send({ message: 'Некорректный _id карточки' });
    return;
  }
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Карточка не найдена' });
        return;
      }
      res.send({ data: card });
    })
    .catch(() => {
      res.status(500).send({ message: 'Ошибка сервера при удалении карточки' });
    });
};

module.exports.cardLike = (req, res) => {
  const { id } = req.params.cardId;
  const { userId } = req.user._id;

  Card.findByIdAndUpdate(
    id,
    { $addToSet: { likes: userId } },
    { new: true },
  )
    .populate(['owner', 'likes'])
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'Карточка не найдена' });
      }
      return res.send({ data: card });
    })
    .catch(() => {
      res.status(400).send({ message: 'Некорекктный _id' });
    });
};

module.exports.deleteCardLike = (req, res) => {
  const { cardId } = req.params;
  const { userId } = req.user._id;

  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: userId } },
    { new: true },
  )
    .populate(['owner', 'likes'])
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'Карточка не найдена' });
      }
      return res.send({ data: card });
    })
    .catch(() => {
      res.status(400).send({ message: 'Некорекктный _id' });
    });
};
