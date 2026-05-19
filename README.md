# Zentora - React UI Builder

A powerful and intuitive UI builder application that allows users to create, design, and manage visual canvases with ease. Zentora combines a modern React frontend with a robust Node.js backend to deliver a seamless design experience.

🌐 **Live Demo**: [https://zentora.zamam.in](https://zentora.zamam.in)

---

## Table of Contents

- [About the Project](#about-the-project)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Local Setup](#local-setup)
  - [Docker Setup](#docker-setup)
- [Project Structure](#project-structure)
- [License](#license)

---

## About the Project

Zentora is a full-stack web application designed for creating and managing UI designs. The platform provides a collaborative environment where users can:

- Create and edit interactive canvases with geometric shapes
- Manage user profiles with detailed information
- Customize application settings
- Authenticate securely with JWT-based authentication
- Store and retrieve canvas data with a MongoDB backend

The application is built with modern development practices, featuring a responsive React frontend powered by Vite and a scalable Node.js backend with Express.

---

## Tech Stack

**Frontend:**

- React 18
- Vite (build tool)
- ESLint (code quality)
- Modern CSS for styling

**Backend:**

- Node.js
- Express.js
- MongoDB (database)
- JWT Authentication

**DevOps:**

- Docker & Docker Compose
- Vercel (deployment)

---

## Features

- ✨ **Interactive Canvas Editor** - Create rectangles and shapes in real-time
- 👤 **User Profiles** - Manage user information and preferences
- 🔐 **Secure Authentication** - JWT-based login and registration
- ⚙️ **Settings Management** - Customize application behavior
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile
- 🐳 **Docker Support** - Easy deployment with Docker Compose

---

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

**Option 1 - Local Development:**

- Node.js (v14 or higher)
- npm or yarn
- Git
- MongoDB (local or Atlas)

**Option 2 - Docker:**

- Docker
- Docker Compose

---

## Local Setup

### Step 1: Clone the Repository

```bash
git clone https://github.com/injamamulhak0804/zentora.git
cd zentora
```

### Step 2: Setup Backend

Navigate to the backend directory and install dependencies:

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory with the following variables:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/zentora
JWT_SECRET=your_secret_key_here
```

Start the backend server:

```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Step 3: Setup Frontend

In a new terminal, navigate to the app directory:

```bash
cd app
npm install
```

Create a `.env` file in the app directory (if needed):

```env
VITE_API_URL=http://localhost:5000
```

Start the development server:

```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

### Step 4: Access the Application

Open your browser and navigate to `http://localhost:5173`

---

## Docker Setup

### Prerequisites

- Docker installed on your system
- Docker Compose installed

### Step 1: Clone the Repository

```bash
git clone https://github.com/injamamulhak0804/zentora.git
cd zentora
```

### Step 2: Configure Environment Variables

Create a `.env` file in the root directory:

```env
MONGODB_URI=mongodb://mongo:27017/zentora
JWT_SECRET=your_secret_key_here
NODE_ENV=production
```

### Step 3: Build and Run with Docker Compose

Build and start all services:

```bash
docker-compose up --build
```

Or run in detached mode:

```bash
docker-compose up -d --build
```

### Step 4: Access the Application

- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:5000](http://localhost:5000)

### Useful Docker Commands

```bash
# View running containers
docker-compose ps

# View logs
docker-compose logs

# View logs for specific service
docker-compose logs backend
docker-compose logs app

# Stop all services
docker-compose stop

# Stop and remove all services
docker-compose down

# Stop and remove everything including volumes
docker-compose down -v
```

---

## Project Structure

```
zentora/
├── app/                          # Frontend (React + Vite)
│   ├── src/
│   │   ├── component/           # React components
│   │   │   ├── Canva/           # Canvas editor components
│   │   │   ├── Profile/         # Profile management
│   │   │   ├── shared/          # Shared components
│   │   │   └── ui/              # UI component library
│   │   ├── pages/               # Page components
│   │   ├── assets/              # SVG and media files
│   │   ├── App.jsx              # Main app component
│   │   └── main.jsx             # Entry point
│   ├── package.json
│   ├── vite.config.js
│   └── Dockerfile
│
├── backend/                      # Backend (Node.js + Express)
│   ├── src/
│   │   ├── controllers/         # Request handlers
│   │   ├── models/              # Database schemas
│   │   ├── routes/              # API routes
│   │   ├── middleware/          # Custom middleware
│   │   ├── config/              # Configuration
│   │   ├── utils/               # Utility functions
│   │   └── server.js            # Entry point
│   ├── package.json
│   ├── vercel.json
│   └── Dockerfile
│
├── docker-compose.yml           # Docker Compose configuration
└── README.md                     # This file
```

---

## Environment Variables

### Backend

| Variable      | Description                | Example                             |
| ------------- | -------------------------- | ----------------------------------- |
| `PORT`        | Server port                | `5000`                              |
| `MONGODB_URI` | MongoDB connection string  | `mongodb://localhost:27017/zentora` |
| `JWT_SECRET`  | Secret key for JWT signing | `your_secret_key_here`              |
| `NODE_ENV`    | Environment mode           | `development` or `production`       |

### Frontend

| Variable       | Description     | Example                 |
| -------------- | --------------- | ----------------------- |
| `VITE_API_URL` | Backend API URL | `http://localhost:5000` |

---

## Troubleshooting

### Port Already in Use

If port 5000 or 5173 is already in use, you can change them in the respective configuration files or use:

```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

### MongoDB Connection Issues

- Ensure MongoDB is running locally or update `MONGODB_URI` to your MongoDB Atlas connection string
- Check database credentials if using MongoDB Atlas

### Docker Issues

- Ensure Docker daemon is running
- Check Docker logs: `docker-compose logs`
- Clear Docker cache: `docker-compose down -v && docker-compose up --build`

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## Contact & Support

For questions, issues, or suggestions, please open an issue on the [GitHub repository](https://github.com/injamamulhak0804/zentora).

🌐 **Live Demo**: [https://zentora.zamam.in](https://zentora.zamam.in)

---

**Happy Building! 🎨**
