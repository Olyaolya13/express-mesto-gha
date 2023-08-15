const mongoose = require('mongoose');
const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.send({ data: users });
    })
    .catch(() => {
      res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.getUsersById = (req, res) => {
  const { id } = req.params.userId;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).send({ message: 'Неверный пользователь с некорректным id' });
  }

  return User.findById(id)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'Пользователь не найден' });
      }
      return res.send({ data: user });
    })
    .catch(() => res.status(400).send({ message: 'Некорректный _id пользователя' }));
};

module.exports.createUsers = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(201).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') { res.status(400).send({ message: err.message }); } else { res.status(500).send({ message: 'На сервере произошла ошибка' }); }
    });
};

module.exports.editUsers = (req, res) => {
  const { name, about } = req.body;
  const userId = req.user._id;
  if (userId) {
    User.findByIdAndUpdate(userId, { name, about }, {
      new: true,
      runValidators: true,
      upsert: true,
    })
      .then((user) => res.send({ data: user }))
      .catch((err) => {
        if (err.name === 'ValidationError') { res.status(400).send({ message: err.message }); } else { res.status(404).send({ message: 'Пользователь не найден' }); }
      });
  } else {
    res.status(500).send({ message: 'На сервере произошла ошибка' });
  }
};

module.exports.editAvatar = (req, res) => {
  const userId = req.user._id;
  const { avatar } = req.body;
  if (userId) {
    User.findByIdAndUpdate(userId, { avatar }, {
      new: true,
      runValidators: true,
      upsert: true,
    })
      .then((user) => res.send({ data: user }))
      .catch((err) => {
        if (err.name === 'ValidationError') { res.status(400).send({ message: err.message }); } else { res.status(404).send({ message: 'Пользователь не найден' }); }
      });
  } else {
    res.status(500).send({ message: 'На сервере произошла ошибка' });
  }
};
