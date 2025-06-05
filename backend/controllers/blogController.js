const Blog = require("../models/Blog");
const User = require("../models/User");

/**
 * @desc    Create a new blog post
 * @route   POST /api/blogs
 * @access  Private (Requires authentication)
 * @param {import('express').Request & { user?: { _id: string, name: string } }} req - Express request object, augmented with user property from auth middleware
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 */
const createBlog = async (req, res, next) => {
  const { title, category, content, image } = req.body;
  try {
    if (!title || !category || !content) {
      res.status(400);
      throw new Error("Title, category, and content are required fields.");
    }
    if (!req.user || !req.user._id) {
      res.status(401);
      throw new Error("User not authenticated or user data incomplete.");
    }
    const blog = new Blog({
      title,
      category,
      content,
      image: image || undefined,
      userId: req.user._id,
      authorName: req.user.name,
    });
    const createdBlog = await blog.save();
    res.status(201).json(createdBlog);
  } catch (error) {
    if (error.name === "ValidationError") {
      res.status(400);
    }
    next(error);
  }
};

/**
 * @desc    Get all blog posts with optional filtering and pagination
 * @route   GET /api/blogs
 * @route   GET /api/blogs?category=:category&authorName=:authorName&page=:page&limit=:limit
 * @access  Public
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 */
const getBlogs = async (req, res, next) => {
  try {
    const pageSize = Number(req.query.limit) || 10;
    const page = Number(req.query.page) || 1;
    const query = {};
    if (req.query.category) {
      query.category = req.query.category;
    }
    if (req.query.authorName) {
      query.authorName = req.query.authorName;
    }
    const count = await Blog.countDocuments(query);
    const blogs = await Blog.find(query)
      .sort({ createdAt: -1 })
      .limit(pageSize)
      .skip(pageSize * (page - 1));
    res.json({
      blogs,
      page,
      pages: Math.ceil(count / pageSize),
      count,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a single blog post by ID
 * @route   GET /api/blogs/:id
 * @access  Public
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 */
const getBlogById = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (blog) {
      res.json(blog);
    } else {
      res.status(404);
      throw new Error("Blog post not found");
    }
  } catch (error) {
    if (error.name === "CastError" && error.kind === "ObjectId") {
      res.status(400);
      return next(new Error("Invalid blog post ID format"));
    }
    next(error);
  }
};

/**
 * @desc    Update an existing blog post
 * @route   PUT /api/blogs/:id
 * @access  Private (Author only)
 * @param {import('express').Request & { user?: { _id: string } }} req - Express request object, augmented with user property
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 */
const updateBlog = async (req, res, next) => {
  const { title, category, content, image } = req.body;
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      res.status(404);
      throw new Error("Blog post not found");
    }
    if (!req.user || blog.userId.toString() !== req.user._id.toString()) {
      res.status(403); // Forbidden
      throw new Error("User not authorized to update this blog post");
    }
    blog.title = title || blog.title;
    blog.category = category || blog.category;
    blog.content = content || blog.content;
    blog.image = image !== undefined ? image : blog.image;
    const updatedBlog = await blog.save();
    res.json(updatedBlog);
  } catch (error) {
    if (error.name === "ValidationError") {
      res.status(400);
    } else if (error.name === "CastError" && error.kind === "ObjectId") {
      res.status(400);
      return next(new Error("Invalid blog post ID format"));
    }
    next(error);
  }
};

/**
 * @desc    Delete a blog post
 * @route   DELETE /api/blogs/:id
 * @access  Private (Author only)
 * @param {import('express').Request & { user?: { _id: string } }} req - Express request object, augmented with user property
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 */
const deleteBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      res.status(404);
      throw new Error("Blog post not found");
    }

    if (!req.user || blog.userId.toString() !== req.user._id.toString()) {
      res.status(403); // Forbidden
      throw new Error("User not authorized to delete this blog post");
    }

    await Blog.findByIdAndDelete(req.params.id);
    res.json({ message: "Blog post removed successfully" });
  } catch (error) {
    if (error.name === "CastError" && error.kind === "ObjectId") {
      res.status(400);
      return next(new Error("Invalid blog post ID format"));
    }
    next(error);
  }
};

module.exports = {
  createBlog,
  getBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
};
