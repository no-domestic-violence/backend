class ErrorHandler extends Error {
  constructor(statusCode, message) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }

  static badRequest(message) {
    return new ErrorHandler(400, message);
  }

  static unauthorized(message) {
    return new ErrorHandler(401, message);
  }

  static forbidden(message) {
    return new ErrorHandler(403, message);
  }
  
  static internal(message) {
    return new ErrorHandler(500, message);
  }

  static notFound(message) {
    return new ErrorHandler(404, message);
  }

  static unprocessableEntity(message) {
    return new ErrorHandler(422, message);
  }
}

module.exports = ErrorHandler;
