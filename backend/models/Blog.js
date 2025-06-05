const mongoose = require("mongoose");

/**
 * Mongoose schema for Blog posts.
 * @typedef {Object} BlogSchema
 * @property {string} title - The title of the blog post. Required.
 * @property {string} category - The category of the blog post. Required.
 * @property {string} authorName - The name of the user who authored the blog post. Required.
 * @property {string} content - The main content of the blog post. Required.
 * @property {string} [image] - URL of an image associated with the blog post. Optional, must be a valid URL.
 * @property {mongoose.Schema.Types.ObjectId} userId - Reference to the User who created the blog post. Required.
 * @property {Date} createdAt - Timestamp of blog post creation (auto-generated).
 * @property {Date} updatedAt - Timestamp of last blog post update (auto-generated).
 */

/**
 * Mongoose model for Blog.
 * Includes indexes on category, userId, and a text index on title and content.
 * @class Blog
 */
const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a title for your blog post"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Please specify a category for your blog post"],
      // Consider using an enum if categories are strictly predefined, e.g.
      // enum: ['Career', 'Finance', 'Travel', 'Technology', 'Lifestyle', 'Other'],
      trim: true,
    },
    authorName: {
      // Storing author's name for quick display
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: [true, "Please provide content for your blog post"],
    },
    image: {
      type: String, // URL to the image
      trim: true,
      match: [
        /^(ftp|http|https):\/\/[^ \"]+$/,
        "Please enter a valid image URL",
      ], // Basic URL validation
      default: "", // Optional field
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User", // Reference to the User model
    },
    // createdAt and updatedAt will be automatically added by timestamps: true
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
  }
);

// Indexing for fields commonly used in queries to improve performance
blogSchema.index({ category: 1 });
blogSchema.index({ userId: 1 });
blogSchema.index({ title: "text", content: "text" }); // For text search capabilities if needed later

const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;
