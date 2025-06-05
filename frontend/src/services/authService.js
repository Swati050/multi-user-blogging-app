import axios from "axios";

const API_URL = import.meta.env.PROD
  ? "https://multi-user-blogging-app.onrender.com/api/auth"
  : "/api/auth";

/**
 * @service authService
 * @description Service module for handling all authentication-related API calls.
 * Uses axios for HTTP requests and manages JWT tokens.
 */
const authService = {
  /**
   * @function signup
   * @description Registers a new user.
   * @param {Object} userData - The user registration data
   * @param {string} userData.name - The user's full name
   * @param {string} userData.email - The user's email address
   * @param {string} userData.password - The user's password
   * @returns {Promise<Object>} The user data including JWT token
   */
  signup: async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/signup`, userData);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to create account"
      );
    }
  },

  /**
   * @function login
   * @description Logs in an existing user.
   * @param {Object} credentials - The user login credentials
   * @param {string} credentials.email - The user's email address
   * @param {string} credentials.password - The user's password
   * @returns {Promise<Object>} The user data including JWT token
   */
  login: async (credentials) => {
    try {
      const response = await axios.post(`${API_URL}/login`, credentials);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Invalid email or password"
      );
    }
  },

  /**
   * @function getCurrentUser
   * @description Fetches the current user's data using their JWT token.
   * @returns {Promise<Object>} The current user's data
   */
  getCurrentUser: async () => {
    try {
      const response = await axios.get(`${API_URL}/me`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch user data"
      );
    }
  },

  /**
   * @function updateProfile
   * @description Updates the current user's profile information.
   * @param {Object} userData - The updated user data
   * @param {string} [userData.name] - The updated name
   * @param {string} [userData.email] - The updated email
   * @param {string} [userData.password] - The updated password
   * @returns {Promise<Object>} The updated user data
   */
  updateProfile: async (userData) => {
    try {
      const response = await axios.put(`${API_URL}/profile`, userData);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to update profile"
      );
    }
  },

  /**
   * @function changePassword
   * @description Changes the current user's password.
   * @param {Object} passwordData - The password change data
   * @param {string} passwordData.currentPassword - The current password
   * @param {string} passwordData.newPassword - The new password
   * @returns {Promise<Object>} Success message
   */
  changePassword: async (passwordData) => {
    try {
      const response = await axios.put(
        `${API_URL}/change-password`,
        passwordData
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to change password"
      );
    }
  },
};

export default authService;
