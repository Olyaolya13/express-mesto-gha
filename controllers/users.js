const { HTTP_STATUS_CREATED } = require('http2').constants;
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');
const ConflictError = require('../errors/conflict-error');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.status(HTTP_STATUS_CREATED).send({ data: users });
    })
    .catch(next);
};

module.exports.getUsersById = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail()
    .then((users) => {
      res.status(HTTP_STATUS_CREATED).send({ data: users });
    })
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
    .then((users) => {
      res.status(201).send({ data: users });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(err.message));
      } else if (err.code === 11000) {
        next(new ConflictError('Пользователь уже существует'));
      } else {
        next(err);
      }
    });
};

module.exports.editUsers = (req, res, next) => {
  const { name, about } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(userId, { name, about }, {
    new: true,
    runValidators: true,
    upsert: true,
  })
    .then((users) => {
      res.status(HTTP_STATUS_CREATED).send({ data: users });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(err.message));
      } else if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError(`Пользователь ${req.params.userId} не найден`));
      } else {
        next(err);
      }
    });
};

module.exports.editAvatar = (req, res, next) => {
  const userId = req.user._id;
  const { avatar } = req.body;

  User.findByIdAndUpdate(userId, { avatar }, {
    new: true,
    runValidators: true,
    upsert: true,
  })
    .then((users) => {
      res.status(HTTP_STATUS_CREATED).send({ data: users });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(err.message));
      } else if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError(`Пользователь ${req.params.userId} не найден`));
      } else {
        next(err);
      }
    });
};
