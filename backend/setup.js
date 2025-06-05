const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// Create .env file if it doesn't exist
const envPath = path.join(__dirname, ".env");
if (!fs.existsSync(envPath)) {
  const envContent = `PORT=5000
MONGO_URI=mongodb://localhost:27017/blog-app
JWT_SECRET=your-super-secret-jwt-key-change-in-production
NODE_ENV=development`;

  fs.writeFileSync(envPath, envContent);
  console.log("Created .env file with default configuration");
}

// Check if MongoDB is installed
try {
  execSync("mongod --version", { stdio: "ignore" });
  console.log("MongoDB is installed");
} catch (error) {
  console.error("MongoDB is not installed. Please install MongoDB first:");
  console.error(
    "1. Download MongoDB from https://www.mongodb.com/try/download/community"
  );
  console.error(
    "2. Install MongoDB following the instructions for your operating system"
  );
  console.error("3. Start MongoDB service");
  process.exit(1);
}

// Check if MongoDB service is running
try {
  execSync('mongosh --eval "db.version()"', { stdio: "ignore" });
  console.log("MongoDB service is running");
} catch (error) {
  console.error("MongoDB service is not running. Please start MongoDB:");
  console.error("1. On Windows: Start MongoDB service from Services");
  console.error(
    '2. On macOS/Linux: Run "sudo service mongod start" or "brew services start mongodb-community"'
  );
  process.exit(1);
}

console.log("\nSetup completed successfully!");
console.log("You can now start the backend server with: npm run dev");
