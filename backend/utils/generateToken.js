const jwt = require("jsonwebtoken");

/**
 * Generates a JSON Web Token (JWT) for a given user ID.
 * The token is signed with the JWT_SECRET from environment variables and expires in 30 days.
 * @param {string} userId - The ID of the user for whom the token is generated.
 * @returns {string} The generated JWT.
 */
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "30d", // Token expires in 30 days
  });
};

module.exports = generateToken;
