const { HTTP_STATUS_CONFLICT } = require('node:http2');// 409

class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = HTTP_STATUS_CONFLICT;
  }
}

module.exports = ConflictError;
