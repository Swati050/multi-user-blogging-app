import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // Default Vite port
    proxy: {
      // Proxy API requests to the backend server
      "/api": {
        target:
          process.env.NODE_ENV === "production"
            ? "https://multi-user-blogging-app.onrender.com"
            : "http://localhost:5000",
        changeOrigin: true,
        secure: false,
        // Optionally rewrite paths if needed
        // rewrite: (path) => path.replace(/^\/api/, '')
      },
    },
  },
  // Build configuration
  build: {
    outDir: "dist", // Output directory for production build
    sourcemap: true, // Generate source maps for debugging
    // Optimize chunk size
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"],
          ui: [
            "@chakra-ui/react",
            "@emotion/react",
            "@emotion/styled",
            "framer-motion",
          ],
        },
      },
    },
  },
});
