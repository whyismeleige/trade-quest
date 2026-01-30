class AppError extends Error {
  constructor(message, statusCode, type = "error") {
    super(message);
    this.statusCode = statusCode;
    this.type = type;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

class ValidationError extends AppError {
  constructor(message = "Invalid Input") {
    super(message, 400, "error");
  }
}

class AuthorizationError extends AppError {
  constructor(message = "Unauthorized Access") {
    super(message, 403, "error");
  }
}

class AuthenticationError extends AppError {
  constructor(message = "Authentication Failed") {
    super(message, 401, "error");
  }
}

class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super(message, 404, "error");
  }
}

class ConflictError extends AppError {
  constructor(message = "Conflict Error") {
    super(message, 409, "error");
  }
}

module.exports = {
  AppError,
  ValidationError,
  AuthorizationError,
  AuthenticationError,
  NotFoundError,
  ConflictError
};