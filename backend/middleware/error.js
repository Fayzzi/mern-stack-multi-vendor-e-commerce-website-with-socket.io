// middleware/errorHandler.js

const ErrorHandler = require("../utils/ErrorHandler");

module.exports = (err, req, res, next) => {
  // Set default values for status code and message
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  // Handle wrong MongoDB ID error
  if (err.name === "CastError") {
    const message = `Resource not found with this ID. Invalid ${err.path}`;
    err = new ErrorHandler(message, 400);
  }

  // Handle Duplicate Key error
  if (err.code === 11000) {
    const message = `Duplicate key ${Object.keys(err.keyValue)} entered`;
    err = new ErrorHandler(message, 400);
  }

  // Handle wrong JWT error
  if (err.name === "JsonWebTokenError") {
    const message = "Your URL is invalid. Please try again later";
    err = new ErrorHandler(message, 400);
  }

  // Handle JWT expiration error
  if (err.name === "TokenExpiredError") {
    const message = "Your URL has expired. Please try again later";
    err = new ErrorHandler(message, 400);
  }

  // Send the error response
  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};
