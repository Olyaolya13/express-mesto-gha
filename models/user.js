const mongoose = require('mongoose');

// Проверка на корректный URL
function isValidURL(url) {
  const urlPattern = /^(https?:\/\/)([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
  return urlPattern.test(url);
}

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator: isValidURL,
      message: 'Некорректный URL для аватара',
    },
  },
}, { versionKey: false });// убираем версию документа (записи) в базе данных MongoDb

module.exports = mongoose.model('user', userSchema);
