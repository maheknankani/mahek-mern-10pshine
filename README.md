
# Notes App - MERN Stack Application

A full-stack notes application built with MongoDB, Express.js, React, and Node.js. This application allows users to create, edit, delete, and organize their notes with features like pinning, archiving, tagging, and color coding.

## Features

### Backend Features
- **User Authentication**: JWT-based authentication with registration and login
- **Note Management**: Full CRUD operations for notes
- **Advanced Features**: 
  - Pin/unpin notes
  - Archive/unarchive notes
  - Tag system
  - Color coding
  - Search functionality
  - Pagination
- **Security**: 
  - Password hashing with bcrypt
  - Rate limiting
  - Helmet for security headers
  - CORS configuration
- **Logging**: Comprehensive request and error logging with Pino
- **Error Handling**: Centralized error handling middleware

### Frontend Features
- **Modern UI**: Clean and responsive design with Tailwind CSS
- **Authentication**: Login and registration forms with validation
- **Note Management**: 
  - Create, edit, view, and delete notes
  - Rich text editing
  - Real-time search
  - Filter by pinned/archived status
  - Tag management
  - Color picker for note backgrounds
- **User Experience**:
  - Toast notifications
  - Loading states
  - Responsive design
  - Protected routes
  - Form validation

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Pino** - Logging
- **Helmet** - Security
- **Express Rate Limit** - Rate limiting
- **CORS** - Cross-origin resource sharing

### Frontend
- **React** - UI library
- **React Router** - Routing
- **Axios** - HTTP client
- **React Hook Form** - Form handling
- **React Hot Toast** - Notifications
- **Lucide React** - Icons
- **Tailwind CSS** - Styling
- **date-fns** - Date utilities

## Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v16 or higher)
- **MongoDB** (local installation or MongoDB Atlas)
- **npm** or **yarn**

## Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd mahek-mern-10pshine
```

### 2. Backend Setup

Navigate to the backend directory:
```bash
cd backend
```

Install dependencies:
```bash
npm install
```

Create environment file:
```bash
cp env.example .env
```

Update the `.env` file with your MongoDB connection string:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database - Replace with your MongoDB connection string
MONGODB_URI=mongodb://localhost:27017/notes-app

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here-make-this-very-long-and-secure
JWT_EXPIRES_IN=7d

# Logging
LOG_LEVEL=info

# CORS
CORS_ORIGIN=http://localhost:3000
```

Start the backend server:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

The backend server will run on `http://localhost:5000`

### 3. Frontend Setup

Navigate to the frontend directory:
```bash
cd frontend
```

Install dependencies:
```bash
npm install
```

Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## MongoDB Setup

### Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service
3. Update the `MONGODB_URI` in your `.env` file to point to your local MongoDB instance

### MongoDB Atlas (Cloud)
1. Create a MongoDB Atlas account
2. Create a new cluster
3. Get your connection string
4. Update the `MONGODB_URI` in your `.env` file with your Atlas connection string

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update user profile

### Notes
- `GET /api/notes` - Get all notes (with pagination, search, filters)
- `POST /api/notes` - Create a new note
- `GET /api/notes/:id` - Get a specific note
- `PUT /api/notes/:id` - Update a note
- `DELETE /api/notes/:id` - Delete a note
- `PATCH /api/notes/:id/pin` - Toggle pin status
- `PATCH /api/notes/:id/archive` - Toggle archive status

### Health Check
- `GET /api/ping` - Health check endpoint

## Usage

1. **Register/Login**: Create a new account or login with existing credentials
2. **Create Notes**: Click "New Note" to create your first note
3. **Organize Notes**: 
   - Pin important notes
   - Archive old notes
   - Add tags for categorization
   - Use colors for visual organization
4. **Search**: Use the search bar to find notes by title or content
5. **Filter**: Filter notes by pinned or archived status

## Project Structure

```
mahek-mern-10pshine/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   └── noteController.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   ├── errorHandler.js
│   │   │   └── requestLogger.js
│   │   ├── modules/
│   │   │   ├── User.js
│   │   │   └── Note.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── notes.js
│   │   │   └── index.js
│   │   └── utiles/
│   │       └── logger.js
│   ├── package.json
│   └── index.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Development

### Backend Development
```bash
cd backend
npm run dev  # Starts with nodemon for auto-reload
```

### Frontend Development
```bash
cd frontend
npm run dev  # Starts Vite dev server
```

### Building for Production
```bash
# Backend
cd backend
npm start

# Frontend
cd frontend
npm run build
npm run preview
```





