// const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const InternalServerError = require('../errors/internal-server-error');
const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');
const ConflictError = require('../errors/conflict-error');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.send({ data: users });
    })
    .catch(() => {
      const err = new InternalServerError('На сервере произошла ошибка');
      next(err);
    });
};

module.exports.getUsersById = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail()
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Некорректные данные пользователя'));
      } else if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError(`Пользователь ${req.params.userId} не найден`));
      } else {
        next(err);
      }
    });
};

module.exports.createUsers = (req, res, next) => {
  const {
    email, name, about, avatar, password,
  } = req.body;
  // хешируем пароль
  bcrypt.hash(password, 10)
    .then((hash) => User.create(
      {
        name, about, avatar, email, password: hash,
      },
    ))
    .then((user) => res.status(201).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Ошибка валидации'));
      } else if (err.code === 11000) {
        next(new ConflictError('Пользователь уже существует'));
      } else {
        next(err);
      }
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
