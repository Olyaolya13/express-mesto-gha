const { HTTP_STATUS_BAD_REQUEST } = require('http2').constants;// 400
// console.log(HTTP_STATUS_BAD_REQUEST);

class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = HTTP_STATUS_BAD_REQUEST;
  }
}

module.exports = BadRequestError;
