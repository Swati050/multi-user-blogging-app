import axios from "axios";

const API_URL = import.meta.env.PROD
  ? "https://blog-app-backend.onrender.com/api/blogs"
  : "/api/blogs";

/**
 * @service blogService
 * @description Service module for handling all blog-related API calls.
 * Uses axios for HTTP requests and handles authentication via interceptors.
 */
const blogService = {
  /**
   * @function getAllBlogs
   * @description Fetches all blogs with optional filtering and pagination.
   * @param {Object} params - Query parameters for filtering and pagination
   * @param {string} [params.category] - Filter by category
   * @param {string} [params.authorName] - Filter by author name
   * @param {number} [params.page=1] - Page number for pagination
   * @param {number} [params.limit=6] - Number of blogs per page
   * @returns {Promise<Object>} Object containing blogs array, pagination info
   */
  getAllBlogs: async (params = {}) => {
    try {
      const response = await axios.get(API_URL, { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch blogs");
    }
  },

  /**
   * @function getBlogById
   * @description Fetches a single blog post by its ID.
   * @param {string} id - The ID of the blog post to fetch
   * @returns {Promise<Object>} The blog post data
   */
  getBlogById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch blog post"
      );
    }
  },

  /**
   * @function createBlog
   * @description Creates a new blog post.
   * @param {Object} blogData - The blog post data
   * @param {string} blogData.title - The title of the blog post
   * @param {string} blogData.category - The category of the blog post
   * @param {string} blogData.content - The content of the blog post
   * @param {string} [blogData.image] - Optional image URL for the blog post
   * @returns {Promise<Object>} The created blog post data
   */
  createBlog: async (blogData) => {
    try {
      const response = await axios.post(API_URL, blogData);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to create blog post"
      );
    }
  },

  /**
   * @function updateBlog
   * @description Updates an existing blog post.
   * @param {string} id - The ID of the blog post to update
   * @param {Object} blogData - The updated blog post data
   * @param {string} [blogData.title] - The updated title
   * @param {string} [blogData.category] - The updated category
   * @param {string} [blogData.content] - The updated content
   * @param {string} [blogData.image] - The updated image URL
   * @returns {Promise<Object>} The updated blog post data
   */
  updateBlog: async (id, blogData) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, blogData);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to update blog post"
      );
    }
  },

  /**
   * @function deleteBlog
   * @description Deletes a blog post.
   * @param {string} id - The ID of the blog post to delete
   * @returns {Promise<Object>} The response data
   */
  deleteBlog: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to delete blog post"
      );
    }
  },
};

export default blogService;
