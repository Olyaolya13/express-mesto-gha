const { HTTP_STATUS_NOT_FOUND } = require('node:http2');// 404

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = HTTP_STATUS_NOT_FOUND;
  }
}

module.exports = NotFoundError;
