const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

/**
 * Mongoose schema for User.
 * @typedef {Object} UserSchema
 * @property {string} name - User's full name. Required.
 * @property {string} email - User's email address. Required, unique, lowercase. Must be a valid email format.
 * @property {string} password - User's password. Required, min length 6. Not selected by default in queries.
 * @property {Date} createdAt - Timestamp of user creation (auto-generated).
 * @property {Date} updatedAt - Timestamp of last user update (auto-generated).
 */

/**
 * Mongoose model for User.
 * @class User
 */
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide your name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please provide your email"],
      unique: true,
      lowercase: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please provide a valid email address",
      ],
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: [6, "Password must be at least 6 characters long"],
      select: false, // Do not return password by default when querying users
    },
  },
  {
    timestamps: true, // This will add createdAt and updatedAt fields automatically
  }
);

/**
 * Pre-save middleware for the user schema.
 * Hashes the user's password before saving if it has been modified.
 * @param {import('mongoose').NextFunction} next - Mongoose next function.
 */
userSchema.pre("save", async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified("password")) return next();

  // Hash the password with cost of 12
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

/**
 * Instance method on the User schema to compare a candidate password with the stored hashed password.
 * @param {string} candidatePassword - The password to compare.
 * @returns {Promise<boolean>} True if the passwords match, false otherwise.
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
