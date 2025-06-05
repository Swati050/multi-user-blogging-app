import axios from "axios";

const BASE_URL = import.meta.env.PROD
  ? "https://blog-app-backend.onrender.com"
  : "";

// Create axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log("Making request to:", config.url);
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log("Response received:", response.status);
    return response;
  },
  (error) => {
    console.error(
      "Response error:",
      error.response?.status,
      error.response?.data
    );
    return Promise.reject(error);
  }
);

/**
 * @service blogService
 * @description Service module for handling all blog-related API calls.
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
      const response = await api.get("/api/blogs", { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching blogs:", error);
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
      const response = await api.get(`/api/blogs/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching blog:", error);
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
      const response = await api.post("/api/blogs", blogData);
      return response.data;
    } catch (error) {
      console.error("Error creating blog:", error);
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
      const response = await api.put(`/api/blogs/${id}`, blogData);
      return response.data;
    } catch (error) {
      console.error("Error updating blog:", error);
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
      const response = await api.delete(`/api/blogs/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting blog:", error);
      throw new Error(
        error.response?.data?.message || "Failed to delete blog post"
      );
    }
  },
};

export default blogService;
