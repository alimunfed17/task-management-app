# Task Management Application

A full-stack task management application built with FastAPI (backend) and React (frontend) that allows users to manage tasks with authentication, filtering, and CRUD operations.

## 📋 Features

- **User Authentication**: Secure signup, login, and logout functionality
- **Task Management**: Create, read, update, and delete tasks
- **Task Filtering**: Filter tasks by status (Pending, In Progress, Completed)
- **Responsive Design**: Modern UI that works well on mobile and desktop
- **Data Fetching**: Efficient data fetching with caching
- **Docker Support**: Containerized deployment for both frontend and backend

## 🛠️ Tech Stack

### Backend
- **FastAPI**: High-performance API framework
- **SQLAlchemy**: SQL toolkit and ORM
- **JWT**: Token-based authentication
- **SQLite/PostgreSQL**: Database options
- **Pydantic**: Data validation and parsing

### Frontend
- **React**: UI library
- **TypeScript**: Type safety
- **TanStack Query**: Data fetching and caching
- **TanStack Router**: Type-safe routing
- **Tailwind CSS v4**: Utility-first CSS framework

## 🚀 Quick Start

### Using Docker (Recommended)

```bash
# Clone the repository
git clone https://github.com/yourusername/task-management-app.git
cd task-management-app

# Start the application with Docker Compose
cd frontend
docker-compose up -d
```

This will start both the frontend and backend services. The application will be available at http://localhost.

### Manual Setup

#### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Run the setup script
chmod +x setup.sh
./setup.sh

# Start the backend server
source env/bin/activate
uvicorn app.main:app --reload --port 8000
```

The API will be available at http://localhost:8000 with documentation at http://localhost:8000/docs.

#### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Run the setup script
chmod +x setup.sh
./setup.sh

# Start the development server
npm run dev
```

The frontend will be available at http://localhost:5173.

## 📁 Repository Structure

```
task-management-app/
├── backend/                # FastAPI backend
│   ├── app/                # Application code
│   │   ├── api/            # API routes
│   │   ├── core/           # Core functionality
│   │   ├── db/             # Database models and config
│   │   ├── schemas/        # Pydantic schemas
│   │   └── main.py         # Application entry point
│   ├── static/             # Static files
│   ├── Dockerfile          # Backend Docker config
│   └── requirements.txt    # Python dependencies
│
├── frontend/               # React frontend
│   ├── src/                # Source code
│   │   ├── api/            # API clients
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── routes/         # Routing configuration
│   │   └── styles/         # CSS styles
│   ├── Dockerfile          # Frontend Docker config
│   ├── nginx.conf          # Nginx configuration
│   └── docker-compose.yml  # Full stack Docker setup
│
└── README.md               # Main documentation
```

## 📝 API Documentation

The API documentation is available at `/docs` when the backend is running. The main endpoints are:

- **Authentication**:
  - POST `/api/v1/auth/signup`: Register a new user
  - POST `/api/v1/auth/login`: Login and get JWT token
  - GET `/api/v1/auth/test-token`: Test if token is valid

- **Tasks**:
  - GET `/api/v1/tasks/`: List all tasks (with optional status filter)
  - POST `/api/v1/tasks/`: Create a new task
  - GET `/api/v1/tasks/{task_id}`: Get a specific task
  - PUT `/api/v1/tasks/{task_id}`: Update a task
  - DELETE `/api/v1/tasks/{task_id}`: Delete a task

## 🔒 Authentication Flow

1. Users register or login to get a JWT token
2. Token is stored in localStorage
3. Each API request includes the token in the Authorization header
4. Protected routes check authentication before allowing access

## 🐳 Docker Configuration

Both frontend and backend are containerized for easy deployment:

- **Frontend**: Uses a multi-stage build with Node.js for building and Nginx for serving
- **Backend**: Uses Python image with FastAPI
- **Docker Compose**: Orchestrates both services with proper networking

## 🛠️ Troubleshooting

### Database Issues
- Ensure SQLite file permissions are correct
- For PostgreSQL, verify connection settings in `.env`

### API Connection Issues
- Check that the backend is running
- Verify Nginx proxy configuration in the frontend

### Authentication Issues
- Check token expiration time
- Verify that Authorization headers are included in requests

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details. 