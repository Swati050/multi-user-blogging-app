/**
 * Main server file for the Multi-User Blogging Application backend.
 *
 * This file initializes and configures the Express application. It includes:
 * - Loading environment variables using dotenv.
 * - Establishing a connection to the MongoDB database.
 * - Setting up essential middleware: body parser (express.json) and CORS.
 * - Mounting authentication (`/api/auth`) and blog (`/api/blogs`) routes.
 * - Implementing a basic test route (`/`).
 * - Adding custom error handling middleware (404 Not Found and a general error handler).
 * - Starting the Express server on the configured port (from environment variables or default 5000).
 * - Handling unhandled promise rejections to ensure graceful server shutdown.
 */
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");
const blogRoutes = require("./routes/blogRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware"); // Import error handlers

// Load env vars
dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// Debug middleware - Add more detailed logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log("Request Headers:", req.headers);
  console.log("Request Query:", req.query);
  next();
});

// CORS configuration
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? [
            "https://multi-user-blogging-app.vercel.app",
            "https://multi-user-blogging-app-4j4m.vercel.app",
            "http://localhost:5173",
          ]
        : "http://localhost:5173",
    credentials: true,
  })
);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Simple route for testing
app.get("/", (req, res) => {
  res.json({ message: "API is running..." });
});

// Mount routes
console.log("Mounting routes...");
app.use("/api/auth", authRoutes);
app.use("/api/blogs", blogRoutes);
console.log("Routes mounted successfully");

// Connect to MongoDB with improved options
mongoose
  .connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    connectTimeoutMS: 10000,
  })
  .then(() => console.log("MongoDB Connected:", process.env.MONGO_URI))
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1);
  });

// Middleware for 404 Not Found errors - Should be after all specific routes
app.use((req, res, next) => {
  console.log(`404 Not Found: ${req.method} ${req.url}`);
  res.status(404).json({
    statusCode: 404,
    message: `Cannot ${req.method} ${req.url}`,
    error: "Not Found",
  });
});

// Custom Error Handler Middleware - Should be the last middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    statusCode,
    message: err.message,
    error: err.name,
  });
});

const PORT = process.env.PORT || 5000;

// Start the server and keep a reference to it
const server = app.listen(PORT, () => {
  console.log(
    `Server running in ${
      process.env.NODE_ENV || "development"
    } mode on port ${PORT}`
  );
});

// Handle process termination signals
process.on("SIGTERM", () => {
  console.log("SIGTERM received. Shutting down gracefully...");
  server.close(() => {
    console.log("Process terminated");
    mongoose.connection.close(false, () => {
      console.log("MongoDB connection closed");
      process.exit(0);
    });
  });
});

process.on("SIGINT", () => {
  console.log("SIGINT received. Shutting down gracefully...");
  server.close(() => {
    console.log("Process terminated");
    mongoose.connection.close(false, () => {
      console.log("MongoDB connection closed");
      process.exit(0);
    });
  });
});

// Handle unhandled promise rejections (e.g. MongoDB connection issues)
process.on("unhandledRejection", (err, promise) => {
  console.error(`Unhandled Rejection: ${err.message}`);
  // Close server & exit process
  if (server) {
    server.close(() => {
      mongoose.connection.close(false, () => {
        process.exit(1);
      });
    });
  } else {
    process.exit(1);
  }
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  if (server) {
    server.close(() => {
      mongoose.connection.close(false, () => {
        process.exit(1);
      });
    });
  } else {
    process.exit(1);
  }
});
