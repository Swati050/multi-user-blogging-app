const mongoose = require("mongoose");

/**
 * Connects to the MongoDB database using the MONGO_URI environment variable.
 * Logs a success message with the host if the connection is successful.
 * Logs an error message and exits the process with failure (1) if the connection fails.
 * @async
 * @function connectDB
 * @returns {Promise<void>}
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // Mongoose 6 deprecated these options, they are now default
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
      // useCreateIndex: true, // useCreateIndex is no longer supported
      // useFindAndModify: false, // useFindAndModify is no longer supported
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
