# IssueForge

A full-stack issue tracking application built with React and Node.js, featuring real-time CRUD operations with MongoDB integration.

# Project Overview

IssueForge is a modern issue tracking system that allows you to create, view, edit, and delete issues with an intuitive interface. It includes filtering capabilities by status and owner, making issue management efficient and organized.

# Tech Stack

# Frontend

- React.js
- CSS3
- Fetch API

# Backend

- Node.js
- Express.js
- MongoDB with Mongoose
- CORS enabled

# Project Structure

![alt text](image-1.png)

<!-- issueforge/
├── backend/
│ ├── .env # Environment variables (not tracked in git)
│ ├── .env.example # Example environment file
│ ├── .gitignore
│ ├── query/
│ └── server.js # Express backend server
│
├── frontend/
│ ├── node_modules/
│ ├── public/
│ ├── src/
│ │ ├── App.css # Main styles
│ │ ├── App.js # Main React component
│ │ ├── App.test.js
│ │ ├── index.css
│ │ ├── index.js # React entry point
│ │ ├── logo.svg
│ │ ├── reportWebVitals.js
│ │ └── setupTests.js
│ ├── .gitignore
│ ├── package-lock.json
│ ├── package.json # Frontend dependencies
│ └── README.md # Create React App default README
│
└── README.md # This file - Main project documentation -->

# Installation & Setup

# Prerequisites

- Node.js (v14 or higher)
- MongoDB account (MongoDB Atlas recommended)
- npm or yarn package manager

# Step 1: Clone the Repository

git clone https://github.com/Prakshi16/IssueForge.git
cd issueforge

# Step 2: Backend Setup

1. **Install backend dependencies:**
   npm install express cors mongoose dotenv

2. **Create `.env` file in the root directory:**
   MONGODB_URI=your_mongodb_connection_string
   PORT=5000

Replace `your_mongodb_connection_string` with your actual MongoDB connection string from MongoDB Atlas.

3. **Start the backend server:**
   node server.js

The server will run on `http://localhost:5000`

# Step 3: Frontend Setup

1. **Navigate to the frontend directory:**
   cd frontend

2. **Install frontend dependencies:**
   npm install

3. **Start the React development server:**
   npm start

The app will open at `http://localhost:3000`

# Environment Variables

Create a `.env` file in the **root directory** with the following variables:

| Variable      | Description                         | Required |
| ------------- | ----------------------------------- | -------- |
| `MONGODB_URI` | MongoDB connection string           | Yes      |
| `PORT`        | Backend server port (default: 5000) | No       |

# Getting MongoDB URI

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Click "Connect" → "Connect your application"
4. Copy the connection string and replace `<password>` with your database password

# API Endpoints

| Method | Endpoint          | Description           |
| ------ | ----------------- | --------------------- |
| GET    | `/api/issues`     | Fetch all issues      |
| POST   | `/api/issues`     | Create a new issue    |
| PUT    | `/api/issues/:id` | Update an issue by ID |
| DELETE | `/api/issues/:id` | Delete an issue by ID |

# Features

- ✅ Create new issues with title, owner, status, effort, and due date
- ✅ View all issues in a formatted table
- ✅ Edit existing issues inline
- ✅ Delete issues with confirmation
- ✅ Filter issues by status (New, In Progress, Fixed, Closed)
- ✅ Search issues by owner name
- ✅ Responsive design
- ✅ Real-time database synchronization

# Usage

1. **Add an Issue**: Fill out the form at the bottom and click "Add Issue"
2. **Filter Issues**: Use the dropdowns to filter by status or search by owner name
3. **Edit Issue**: Click "Edit" button, modify fields, and click "Save"
4. **Delete Issue**: Click "Delete" button and confirm the action

# Common Issues & Troubleshooting

# Backend won't start

- Ensure `.env` file exists with valid `MONGODB_URI`
- Check if MongoDB Atlas IP whitelist includes your IP (use 0.0.0.0/0 for development)
- Verify Node.js is installed: `node --version`

# Frontend can't connect to backend

- Ensure backend server is running on port 5000
- Check API_URL in `App.js` matches your backend URL
- Verify CORS is enabled in `server.js`

# Database connection error

- Verify MongoDB URI is correct
- Check database user credentials
- Ensure network access is configured in MongoDB Atlas

# License

This project is open source and available for educational purposes.

# 👨‍💻 Contributing

Contributions are welcome! Feel free to submit issues or pull requests.
