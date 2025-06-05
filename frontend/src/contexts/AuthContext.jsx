import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios"; // To set default headers
import authService from "../services/authService";

/**
 * @context AuthContext
 * @description Provides authentication state and actions to the application.
 * Manages user data, loading states, error messages, and JWT token handling (localStorage and Axios headers).
 */
const AuthContext = createContext(null);

/**
 * @hook useAuth
 * @description Custom hook to easily access the AuthContext.
 * @returns {object} The authentication context value.
 */
export const useAuth = () => useContext(AuthContext);

/**
 * @function getUserFromStorage
 * @description Helper function to retrieve and parse user data (including token) from localStorage.
 * Clears corrupted data from localStorage if parsing fails.
 * @returns {object|null} The parsed user object or null if not found or error.
 */
const getUserFromStorage = () => {
  const storedUser = localStorage.getItem("blogUser");
  if (storedUser) {
    try {
      return JSON.parse(storedUser);
    } catch (error) {
      console.error("Error parsing user from localStorage:", error);
      localStorage.removeItem("blogUser"); // Clear corrupted data
      return null;
    }
  }
  return null;
};

/**
 * @provider AuthProvider
 * @description Provides authentication context to its children components.
 * Handles user signup, login, logout, and manages authentication state (user, token, loading, errors).
 * @param {object} props - The component props.
 * @param {React.ReactNode} props.children - The child components to be wrapped by the provider.
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getUserFromStorage()); // User object includes token, name, email etc.
  const [isLoading, setIsLoading] = useState(false); // Tracks loading state for async auth operations
  const [error, setError] = useState(null); // Stores error messages from auth operations

  // Effect to set or clear the default Authorization header for Axios requests
  // based on the presence of a user token.
  useEffect(() => {
    // Set default auth header if user/token exists
    if (user && user.token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${user.token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [user]);

  /**
   * @function signupUser
   * @description Registers a new user through the authService, updates user state,
   * stores user data in localStorage, and sets the Axios auth header.
   * @param {object} userData - User registration data (e.g., name, email, password).
   * @returns {Promise<object>} The user data from the backend upon successful signup.
   * @throws {Error} If signup fails, throws the error for the component to handle.
   */
  const signupUser = async (userData) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await authService.signup(userData);
      setUser(data); // Assuming backend returns user object with token
      localStorage.setItem("blogUser", JSON.stringify(data));
      axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
      return data; // Return data for potential use in component (e.g., redirect)
    } catch (err) {
      setError(err.toString()); // authService throws string messages
      throw err; // Re-throw for component to handle (e.g., display toast)
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * @function loginUser
   * @description Logs in an existing user through the authService, updates user state,
   * stores user data in localStorage, and sets the Axios auth header.
   * @param {object} credentials - User login credentials (e.g., email, password).
   * @returns {Promise<object>} The user data from the backend upon successful login.
   * @throws {Error} If login fails, throws the error for the component to handle.
   */
  const loginUser = async (credentials) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await authService.login(credentials);
      setUser(data); // Assuming backend returns user object with token
      localStorage.setItem("blogUser", JSON.stringify(data));
      axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
      return data;
    } catch (err) {
      setError(err.toString());
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * @function logoutUser
   * @description Logs out the current user by clearing user state, removing data from localStorage,
   * and clearing the Axios auth header.
   */
  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem("blogUser");
    delete axios.defaults.headers.common["Authorization"];
    // authService.logout(); // If it involved an API call
    // No need to navigate here, components can decide where to redirect after logout
  };

  // The value provided to consuming components by the AuthContext.
  const value = {
    user, // Current user object (or null if not logged in)
    isLoading, // Boolean indicating if an auth operation is in progress
    error, // Error message string (or null)
    isAuthenticated: !!(user && user.token), // Boolean indicating if the user is authenticated
    signupUser, // Function to sign up a user
    loginUser, // Function to log in a user
    logoutUser, // Function to log out a user
    clearError: () => setError(null), // Function to clear any existing auth error
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
