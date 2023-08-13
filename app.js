const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

app.use(bodyParser.json());// Обработка JSON-данных
app.use(bodyParser.urlencoded({ extended: true }));// Обработка URL-кодированных данных

mongoose.connect(DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
// .then(() => console.log('Connected to MongoDB'))
// .catch((err) => console.log('Error connecting to MongoDB:', err));

app.use('/users', require('./routes/users'));

app.use((req, res, next) => {
  req.user = {
    _id: '64d8d3202756670f93b3077d',
  };

  next();
});

app.listen(PORT, () => {
  console.log('Server is listening');
});
