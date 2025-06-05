# Multi-User Blogging Application

A full-stack MERN (MongoDB, Express.js, React, Node.js) blogging application that allows users to create, read, update, and delete blog posts.

## Features

- User authentication (register, login, logout)
- Create, read, update, and delete blog posts
- User profiles
- Responsive design
- Real-time updates

## Tech Stack

### Frontend

- React
- Vite
- Chakra UI
- Axios
- React Router

### Backend

- Node.js
- Express.js
- MongoDB
- JWT Authentication
- Bcrypt for password hashing

## Project Structure

```
multi-user-blogging-app/
├── frontend/          # React frontend
│   ├── src/
│   ├── public/
│   └── package.json
└── backend/           # Node.js backend
    ├── routes/
    ├── models/
    ├── middleware/
    └── package.json
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/Swati050/multi-user-blogging-app.git
cd multi-user-blogging-app
```

2. Install backend dependencies:

```bash
cd backend
npm install
```

3. Install frontend dependencies:

```bash
cd ../frontend
npm install
```

4. Create .env files:

Backend (.env):

```
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
PORT=5000
```

Frontend (.env):

```
VITE_API_URL=http://localhost:5000
```

### Running the Application

1. Start the backend server:

```bash
cd backend
npm run dev
```

2. Start the frontend development server:

```bash
cd frontend
npm run dev
```

The application will be available at:

- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## Deployment

The application is deployed using:

- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
