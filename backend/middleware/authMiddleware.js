const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * Middleware to protect routes by verifying JWT token.
 * Expects a Bearer token in the Authorization header.
 * If the token is valid, it attaches the user object (excluding password) to the request object.
 * Throws an error if the token is missing, invalid, or the user is not found.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next middleware function.
 * @throws {Error} If authentication fails.
 */
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header (e.g., "Bearer TOKEN_STRING")
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token (payload has user id)
      // Attach user to the request object, excluding the password
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        res.status(401); // Unauthorized
        throw new Error("Not authorized, user not found");
      }

      next(); // Proceed to the next middleware or route handler
    } catch (error) {
      console.error("Authentication error:", error.message);
      res.status(401); // Unauthorized
      // Send a more generic error message to the client for security
      // but log the specific error on the server (done by console.error)
      throw new Error("Not authorized, token failed or expired");
    }
  }

  if (!token) {
    res.status(401); // Unauthorized
    throw new Error("Not authorized, no token provided");
  }
};

// Optional: Middleware for admin authorization (if needed in the future)
// const admin = (req, res, next) => {
//   if (req.user && req.user.isAdmin) { // Assuming you add an isAdmin field to your User model
//     next();
//   } else {
//     res.status(403); // Forbidden
//     throw new Error('Not authorized as an admin');
//   }
// };

module.exports = { protect };
