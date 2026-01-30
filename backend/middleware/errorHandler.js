const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  console.error("Error:", {
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
  });

  if (err.code === 11000) {
    const message = "Duplicate field value entered";
    error = { message, statusCode: 400, type: "error" };
  }

  if (err.name === "ValidationError") {
    const message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
    error = { message, statusCode: 400, type: "error" };
  }

  if (err.name === "CastError") {
    const message = "Resource not found";
    error = { message, statusCode: 404, type: "error" };
  }

  if (err.name === "JsonWebTokenError") {
    error = {
      message: "Invalid Session, Login Again",
      statusCode: 401,
      type: "error",
    };
  }

  if (err.name === "TokenExpiredError") {
    error = {
      message: "Session Expired, Login Again",
      statusCode: 401,
      type: "error",
    };
  }

  res.status(error.statusCode || 500).send({
    message: error.message || "Server Error",
    type: error.type || "error",
    ...(process.env.NODE_ENV === "development" && {
      stack: err.stack,
      ...(err.originalError && { apiError: err.originalError.message }),
    }),
  });
};

module.exports = errorHandler;