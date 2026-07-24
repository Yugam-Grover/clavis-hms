const { AppError } = require("../utils/errorHandlers");

const handleCastError = (err) =>
  new AppError(`Invalid ${err.path}: ${err.value}`, 400);

const handleDuplicateKeyError = (err) => {
  const field = Object.keys(err.keyValue)[0];
  return new AppError(
    `Duplicate value for field: ${field}. Please use another value`,
    400,
  );
};

const handleValidationError = (err) => {
  const messages = Object.values(err.errors).map((e) => e.message);
  return new AppError(`Validation failed: ${messages.join(". ")}`, 400);
};

const handleJWTError = (err) =>
  new AppError("Invalid token. Please log in again.", 401);

const handleJWTExpiredError = (err) =>
  new AppError("Token expired. Please log in again.", 401);

const sendDevError = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
    error: err,
  });
};

const sendProdError = (err, res) => {
  if (err.isOperational)
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  console.error("Unhandled Error:", err);
  res.status(500).json({
    status: "error",
    message: "something went wrong.",
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    return sendDevError(err, res);
  }
  let error = { ...err, message: err.message };
  if (err.name === "CastError") error = handleCastError(err);
  if (err.code === 11000) error = handleDuplicateKeyError(err);
  if (err.name === "ValidationError") error = handleValidationError(err);
  if (err.name === "JsonWebTokenError") error = handleJWTError(err);
  if (err.name === "TokenExpiredError") error = handleJWTExpiredError(err);
  sendProdError(error, res);
};
