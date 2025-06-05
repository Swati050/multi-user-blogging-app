# Multi-User Blogging Application (MERN Stack)

This is a full-stack web application built using the MERN stack (MongoDB, Express.js, React, Node.js) that enables users to create, manage, and share blog posts in a secure, authenticated environment.

## Project Overview

The application allows users to:

- Register and log in securely using JWT authentication.
- Create, read, update, and delete their own blog posts.
- View all blog posts from the community.
- Filter blog posts by category and author.
- Experience a responsive user interface.

## Features

- **Authentication:** Secure user registration and login (JWT, bcryptjs).
- **Blog Management:** Full CRUD operations for blog posts.
- **Access Control:** Users can only modify/delete their own content.
- **Filtering:** Filter blogs by category or author name.
- **Pagination:** Implemented for blog listings.
- **Responsive Design:** Using Chakra UI for a modern and responsive frontend.
- **RESTful API:** Backend built with Express.js and Node.js.
- **Database:** MongoDB Atlas for data persistence.

## Technology Stack

**Backend:**

- Node.js
- Express.js
- MongoDB (with Mongoose)
- JSON Web Tokens (JWT) for authentication
- bcryptjs for password hashing
- `cors` for Cross-Origin Resource Sharing
- `dotenv` for environment variable management

**Frontend:**

- React.js (with Vite)
- React Router for navigation
- Chakra UI for UI components and styling
- Axios for API communication
- React Context API for global state management (authentication)

## Project Structure

```
multi-user-blogging-app/
├── backend/
│   ├── config/             # Database configuration
│   ├── controllers/        # API route logic (request handlers)
│   ├── middleware/         # Custom middleware (auth, error handling)
│   ├── models/             # Mongoose schemas and models
│   ├── routes/             # API route definitions
│   ├── utils/              # Utility functions (e.g., token generation)
│   ├── .env.example        # Example environment variables
│   ├── .gitignore
│   ├── package.json
│   └── server.js           # Main backend server entry point
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/         # Static assets like images (if any)
│   │   ├── components/     # Reusable React components (Layout, BlogCard, ProtectedRoute)
│   │   ├── contexts/       # React Context API (AuthContext)
│   │   ├── pages/          # Page-level components (HomePage, LoginPage, etc.)
│   │   ├── services/       # API service modules (authService, blogService)
│   │   ├── utils/          # Frontend utility functions (if any)
│   │   ├── App.jsx         # Main React app component with routing
│   │   ├── index.css       # Minimal global styles (mostly handled by Chakra)
│   │   ├── main.jsx        # React app entry point
│   │   └── ...             # Other necessary files and directories
│   ├── .gitignore
│   ├── index.html
│   ├── package.json
│   └── vite.config.js      # Vite configuration (including proxy)
├── .git/
├── masterplan.md           # Development plan document
└── README.md               # This file
```

## Prerequisites

- Node.js (v14.x or later recommended)
- npm (v6.x or later recommended)
- MongoDB Atlas account (or a local MongoDB instance)
- Git

## Setup and Installation

1.  **Clone the repository:**

    ```bash
    git clone <repository_url>
    cd multi-user-blogging-app
    ```

2.  **Backend Setup:**

    ```bash
    cd backend
    npm install
    ```

    - Create a `.env` file in the `backend` directory by copying `.env.example`:
      ```bash
      cp .env.example .env
      ```
    - Open the `.env` file and update the following variables:
      - `PORT`: (Optional) The port for the backend server (defaults to 5001 if not set, or as per server.js).
      - `MONGO_URI`: Your MongoDB connection string (e.g., from MongoDB Atlas).
      - `JWT_SECRET`: A strong, unique secret key for JWT generation.
      - `NODE_ENV`: Set to `development` or `production`.

3.  **Frontend Setup:**
    ```bash
    cd ../frontend
    npm install
    ```
    The frontend is configured to proxy API requests to `http://localhost:5001` (or your backend port) via `vite.config.js`. Ensure your backend is running on this port if you use the default proxy settings.

## Running the Application

1.  **Start the Backend Server:**
    Open a terminal in the `backend` directory:

    ```bash
    npm run dev # Starts the server with nodemon for auto-restarts during development
    # OR
    npm start   # Starts the server with node
    ```

    The backend server should typically be running on `http://localhost:5001` (or the port you configured).

2.  **Start the Frontend Development Server:**
    Open another terminal in the `frontend` directory:
    ```bash
    npm run dev
    ```
    The frontend application should be accessible at `http://localhost:5173` (or another port if 5173 is busy - Vite will indicate this).

## API Endpoints

(Refer to the PRD Section 6 or backend route definitions for detailed API specifications)

**Authentication (`/api/auth`):**

- `POST /signup`: User registration
- `POST /login`: User login

**Blogs (`/api/blogs`):**

- `GET /`: Retrieve all blogs (supports query params: `category`, `authorName`, `page`, `limit`)
- `POST /`: Create a new blog (Protected)
- `GET /:id`: Retrieve a single blog by ID
- `PUT /:id`: Update an existing blog (Protected, Author only)
- `DELETE /:id`: Delete a blog (Protected, Author only)

## Further Development & Testing (Phase 6 & Beyond)

- **Thorough Manual Testing:** Verify all user stories, authentication flows, CRUD operations, filtering, access control, and responsiveness across different devices/browsers.
- **Error Handling:** Ensure comprehensive error handling on both frontend and backend, providing clear feedback to the user.
- **UI/UX Refinements:** Iteratively improve the user interface and experience based on testing and feedback.
- **Performance Optimization:** Check for slow API queries, optimize frontend rendering, and ensure efficient data fetching.
- **Security Hardening:** Review for common web vulnerabilities (XSS, CSRF, etc.) and ensure all security best practices from the PRD are met.
- **Code Documentation:** JSDoc comments have been added to backend functions/modules and complex React components for maintainability.

## Deployment (Example Considerations - Not Implemented Here)

This application is designed to be deployable. Here are some general steps and considerations:

**Backend:**

1.  Set `NODE_ENV=production` in your production environment.
2.  Ensure all necessary environment variables (`MONGO_URI`, `JWT_SECRET`, `PORT`) are configured on your deployment platform.
3.  Build command: Typically `npm install --production` (or just `npm install` if devDependencies are not an issue for your deployment size).
4.  Start command: `npm start` (which runs `node server.js`).
5.  Consider using a process manager like PM2 for Node.js applications in production.
6.  **Containerization (Dockerfile):** A `Dockerfile` can be created to package the backend application for deployment to services like Docker Hub, AWS ECS, Google Cloud Run, Azure Container Instances, etc.

**Frontend:**

1.  Build the static assets:
    ```bash
    cd frontend
    npm run build
    ```
    This will create a `dist` folder with optimized static files.
2.  Deploy the contents of the `frontend/dist` folder to a static hosting service like Vercel, Netlify, AWS S3 (with CloudFront), GitHub Pages, Firebase Hosting, etc.
3.  Ensure your backend API is accessible from the deployed frontend (CORS might need to be configured on the backend for the production frontend URL if not already handled by `*`).

**Database:**

- Use a managed MongoDB service like MongoDB Atlas for production deployments for reliability, backups, and scalability.

This README provides a starting point. Please update it as the project evolves.

## Production Deployment

### Using Docker

1. Build and run with Docker Compose:

   ```bash
   docker-compose up --build
   ```

2. Access the application:
   - Frontend: http://localhost
   - Backend API: http://localhost:5000

### Manual Deployment

1. Build the frontend:

   ```bash
   cd frontend
   npm run build
   ```

2. Set up production environment variables:

   - Create `.env` file in the backend directory with production values
   - Update the frontend API URL in `vite.config.js`

3. Start the backend server:

   ```bash
   cd backend
   npm start
   ```

4. Serve the frontend build:
   - Use a web server (nginx, Apache) to serve the contents of `frontend/dist`
   - Configure the web server to proxy API requests to the backend

## Environment Variables

### Backend (.env)

- `PORT`: Server port (default: 5000)
- `MONGO_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT token generation
- `NODE_ENV`: Environment (development/production)

### Frontend (vite.config.js)

- `VITE_API_URL`: Backend API URL (default: http://localhost:5000)

## Security Considerations

1. Change the JWT secret key in production
2. Use HTTPS in production
3. Implement rate limiting
4. Add input validation
5. Set up proper CORS configuration
6. Use secure MongoDB connection

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT
