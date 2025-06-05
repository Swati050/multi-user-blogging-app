const express = require("express");
const router = express.Router();
const { signupUser, loginUser } = require("../controllers/authController");

/**
 * Route to register a new user.
 * @name POST /api/auth/signup
 * @function
 * @memberof module:routes/authRoutes
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.post("/signup", signupUser);

/**
 * Route to authenticate an existing user and get a token.
 * @name POST /api/auth/login
 * @function
 * @memberof module:routes/authRoutes
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.post("/login", loginUser);

module.exports = router;
