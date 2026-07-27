


// Este archivo define la clase ApiError, que extiende la clase Error de JavaScript nos ayudara a manejar errores de manera más efectiva.

class ApiError extends Error {
  constructor(message, statusCode = 500, errors = null) {
    super(message);

    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.errors = errors;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ApiError;