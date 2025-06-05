/**
 * Custom error handler middleware.
 * Catches errors passed via `next(error)` and formats them into a JSON response.
 * Sets the status code to 500 if it's still 200, otherwise uses the existing status code.
 * Includes stack trace in development mode.
 * @param {Error} err - The error object.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next middleware function.
 */
const errorHandler = (err, req, res, next) => {
  // If status code is already set (e.g. in controller), use it, otherwise default to 500 (Internal Server Error)
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);

  res.json({
    message: err.message,
    // Optionally, include stack trace in development mode
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

/**
 * Middleware for handling 404 Not Found errors.
 * Creates a new Error object for a non-existent route and passes it to the next error handling middleware.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next middleware function.
 */
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error); // Pass the error to the custom error handler
};

module.exports = { errorHandler, notFound };
