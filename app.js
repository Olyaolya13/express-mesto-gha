const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { celebrate, Joi, errors } = require('celebrate');
const { UrlPattern } = require('./errors/constants/constants');

const app = express();
const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

app.use(helmet()); // middleware для усиления безопасности
app.use(bodyParser.json());// Обработка JSON-данных
app.use(bodyParser.urlencoded({ extended: true }));// Обработка URL-кодированных данных

mongoose.connect(DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const { login, createUsers } = require('./controllers/users');
const auth = require('./middlewares/auth');

// роуты, не требующие авторизации,
// например, регистрация и логин
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(2),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(UrlPattern),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(2),
  }).unknown(true),
}), createUsers);

// авторизация
app.use(auth);

// роуты, которым авторизация нужна
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use('*', (req, res) => {
  res.status(404).send({ message: 'Страница не найдена' });
});

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

app.listen(PORT);
