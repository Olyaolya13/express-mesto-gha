const { HTTP_STATUS_UNAUTHORIZED } = require('node:http2');// 401

class UnAuthorizedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = HTTP_STATUS_UNAUTHORIZED;
  }
}

module.exports = UnAuthorizedError;
