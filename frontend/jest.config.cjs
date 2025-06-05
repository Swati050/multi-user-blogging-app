module.exports = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.js"],
  moduleNameMapper: {
    // Handle module aliases (if you're using them in your project)
    "^@/(.*)$": "<rootDir>/src/$1",
    // Handle CSS imports (if you're using CSS modules)
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    // Handle image imports
    "\\.(jpg|jpeg|png|gif|webp|svg)$": "<rootDir>/__mocks__/fileMock.js",
  },
  transform: {
    // Use babel-jest to transform JavaScript files
    "^.+\\.(js|jsx)$": "babel-jest",
  },
  testMatch: [
    // Match test files
    "<rootDir>/src/**/__tests__/**/*.{js,jsx}",
    "<rootDir>/src/**/*.{spec,test}.{js,jsx}",
  ],
  collectCoverageFrom: [
    // Collect coverage from these files
    "src/**/*.{js,jsx}",
    "!src/**/*.d.ts",
    "!src/index.js",
    "!src/reportWebVitals.js",
  ],
  coverageThreshold: {
    // Set minimum coverage thresholds
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  verbose: true,
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
  moduleFileExtensions: ["js", "jsx", "json", "node"],
};
