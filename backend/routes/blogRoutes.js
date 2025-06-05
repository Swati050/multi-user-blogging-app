const express = require("express");
const router = express.Router();
const {
  createBlog,
  getBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
} = require("../controllers/blogController");
const { protect } = require("../middleware/authMiddleware");

/**
 * Route to create a new blog post.
 * @name POST /api/blogs
 * @function
 * @memberof module:routes/blogRoutes
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Authentication middleware.
 * @param {callback} middleware - Express middleware (controller function).
 */
router.post("/", protect, createBlog);

/**
 * Route to get all blog posts, with optional filtering and pagination.
 * @name GET /api/blogs
 * @function
 * @memberof module:routes/blogRoutes
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware (controller function).
 */
router.get("/", getBlogs);

/**
 * Route to get a single blog post by its ID.
 * @name GET /api/blogs/:id
 * @function
 * @memberof module:routes/blogRoutes
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware (controller function).
 */
router.get("/:id", getBlogById);

/**
 * Route to update an existing blog post by its ID.
 * @name PUT /api/blogs/:id
 * @function
 * @memberof module:routes/blogRoutes
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Authentication middleware.
 * @param {callback} middleware - Express middleware (controller function).
 */
router.put("/:id", protect, updateBlog);

/**
 * Route to delete a blog post by its ID.
 * @name DELETE /api/blogs/:id
 * @function
 * @memberof module:routes/blogRoutes
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Authentication middleware.
 * @param {callback} middleware - Express middleware (controller function).
 */
router.delete("/:id", protect, deleteBlog);

// Future routes for blogs (DELETE) will be added here

module.exports = router;
