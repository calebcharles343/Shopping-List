/*/////////////////////////*/
/*  Types of Error */
/*/////////////////////////*/
// Operational Errors : Error we can predict and handle
//e.g request timeout, invalid path, server and database failure

// Programming Errors : Bugs in code by developers
/*/////////////////////////*/
export class AppError extends Error {
  constructor(message, statusCode) {
    super(message); // Initialize parent class to access error behavior

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error"; // Client vs Server errors
    this.isOperational = true; // Indicating that this is a known operational error

    // Ensure stack trace does not include the AppError constructor itself,
    // but starts from where the actual error occurred.
    Error.captureStackTrace(this, this.constructor);
  }
}
