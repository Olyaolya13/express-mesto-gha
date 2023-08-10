const express = require('express');
// const mongoose = require('mongoose');
// const bodyParser = require('body-parser');

const app = express();
const { PORT = 3000 } = process.env;

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.listen(PORT, () => {
  console.log('Server is listening');
});
