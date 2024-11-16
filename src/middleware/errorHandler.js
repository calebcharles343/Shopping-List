import { AppError } from "../utils/appError.js";

const handleJWTError = () =>
  new AppError("Invalid or expired token! Please log in again.", 401);

const handleJWTExpiredError = () =>
  new AppError("Your token has expired! Please log in again.", 401);

const errorHandler = (err, req, res, next) => {
  const env = process.env.NODE_ENV
    ? process.env.NODE_ENV.trim()
    : "development";
  const isDevelopment = env === "development";
  const isProduction = env === "production";

  // If error is not an instance of AppError, create a new AppError with generic message
  if (!(err instanceof AppError)) {
    err = new AppError(err.message, 500);
  }

  // Set default properties if not already set
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (isDevelopment) {
    console.error("Error:", err);
    // Detailed error response in development
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      error: err,
      stack: err.stack,
    });
  }

  if (isProduction) {
    let error = { ...err, message: err.message };

    console.log(error, "xxxxxx");

    if (error.message === "jwt malformed") error = handleJWTError();
    if (error.message === "jwt expired") error = handleJWTExpiredError();

    // Send operational error message; generic message for non-operational errors
    return res.status(error.statusCode).json({
      status: error.status,
      message: error.isOperational ? error.message : "Something went wrong!",
    });
  }

  next();
};

export default errorHandler;
