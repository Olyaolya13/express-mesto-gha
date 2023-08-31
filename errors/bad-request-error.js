const { HTTP_STATUS_BAD_REQUEST } = require('node:http2');// 400
// const http2 = require('node:http2');
// console.log(http2);

class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = HTTP_STATUS_BAD_REQUEST;
  }
}

module.exports = BadRequestError;
