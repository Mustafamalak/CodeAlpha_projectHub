# CodeAlpha ProjectHub

A full-stack project management tool for creating projects, assigning tasks, tracking status, and collaborating through comments.

Built as part of the **CodeAlpha Full Stack Development Internship**.

---

## Features

- **JWT Authentication** — Secure register, login, and protected routes
- **Project Management** — Create, edit, and delete projects with categories, priorities, and deadlines
- **Team Collaboration** — Add and remove project members by email
- **Task Management** — Create, assign, and delete tasks within any project
- **Kanban Board** — Visual task columns: Todo, In Progress, Done
- **Task Status Tracking** — Update task status inline across all views
- **Task Priority Tracking** — Low, Medium, and High priority labels
- **Task Comments** — Threaded comments on individual tasks
- **Dashboard Analytics** — Live summary of projects, tasks, priorities, and overdue items
- **My Tasks Page** — Filtered view of all tasks assigned to the logged-in user
- **Responsive UI** — Clean, polished design that works across all screen sizes
- **Seed Demo Data** — One-command script to populate realistic demo users, projects, and tasks

---

## Tech Stack

### Frontend

| Technology     | Purpose                         |
|----------------|---------------------------------|
| React          | Component-based UI framework    |
| JavaScript     | Application logic               |
| CSS            | Custom styling and design system|
| Axios          | HTTP client for API requests    |
| React Router   | Client-side routing             |
| Lucide React   | Icon library                    |

### Backend

| Technology  | Purpose                              |
|-------------|--------------------------------------|
| Node.js     | JavaScript runtime environment       |
| Express.js  | REST API framework                   |
| MongoDB     | NoSQL document database              |
| Mongoose    | MongoDB object modeling (ODM)        |
| JWT         | Stateless authentication tokens      |
| bcryptjs    | Password hashing                     |

---

## Folder Structure

```
CodeAlpha_projectHub/
├── client/                       # React frontend
│   └── src/
│       ├── api/
│       │   └── axios.js          # Axios instance with auth interceptor
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── ProjectCard.jsx
│       │   ├── TaskCard.jsx
│       │   ├── ProtectedRoute.jsx
│       │   └── Loader.jsx
│       ├── context/
│       │   └── AuthContext.jsx   # Global auth state and session management
│       ├── pages/
│       │   ├── Home.jsx
│       │   ├── Login.jsx
│       │   ├── Signup.jsx
│       │   ├── Dashboard.jsx
│       │   ├── Projects.jsx
│       │   ├── ProjectDetails.jsx
│       │   └── MyTasks.jsx
│       ├── App.jsx               # Route definitions
│       └── index.css             # Global design system and CSS variables
│
└── server/                       # Node.js + Express backend
    ├── config/
    │   └── db.js                 # MongoDB connection
    ├── controllers/
    │   ├── authController.js
    │   ├── projectController.js
    │   └── taskController.js
    ├── middleware/
    │   └── authMiddleware.js     # JWT verification middleware
    ├── models/
    │   ├── User.js
    │   ├── Project.js
    │   └── Task.js
    ├── routes/
    │   ├── authRoutes.js
    │   ├── projectRoutes.js
    │   └── taskRoutes.js
    ├── seed/
    │   └── seedDemoData.js       # Demo data seeder script
    ├── .env
    └── index.js                  # Express app entry point
```

---

## API Reference

### Auth

| Method | Endpoint              | Description              | Auth Required |
|--------|-----------------------|--------------------------|---------------|
| POST   | `/api/auth/register`  | Register a new user      | No            |
| POST   | `/api/auth/login`     | Login and receive token  | No            |
| GET    | `/api/auth/profile`   | Get logged-in user info  | Yes           |

### Projects

| Method | Endpoint                                   | Description                       | Auth Required |
|--------|--------------------------------------------|-----------------------------------|---------------|
| POST   | `/api/projects`                            | Create a new project              | Yes           |
| GET    | `/api/projects`                            | Get all projects for current user | Yes           |
| GET    | `/api/projects/:id`                        | Get a single project by ID        | Yes           |
| PUT    | `/api/projects/:id`                        | Update project (owner only)       | Yes           |
| DELETE | `/api/projects/:id`                        | Delete project (owner only)       | Yes           |
| POST   | `/api/projects/:id/members`                | Add a member by email             | Yes (owner)   |
| DELETE | `/api/projects/:id/members/:memberId`      | Remove a member                   | Yes (owner)   |

### Tasks

| Method | Endpoint                            | Description                         | Auth Required |
|--------|-------------------------------------|-------------------------------------|---------------|
| POST   | `/api/tasks`                        | Create a task in a project          | Yes           |
| GET    | `/api/tasks/project/:projectId`     | Get all tasks for a project         | Yes           |
| GET    | `/api/tasks/my-tasks`               | Get all tasks assigned to you       | Yes           |
| GET    | `/api/tasks/dashboard/summary`      | Get dashboard analytics summary     | Yes           |
| PUT    | `/api/tasks/:id`                    | Update a task                       | Yes           |
| DELETE | `/api/tasks/:id`                    | Delete a task                       | Yes           |
| POST   | `/api/tasks/:id/comments`           | Add a comment to a task             | Yes           |

---

## Getting Started

### Prerequisites

- Node.js v18+
- npm
- A MongoDB Atlas URI (or local MongoDB instance)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/CodeAlpha_projectHub.git
cd CodeAlpha_projectHub
```

### 2. Configure Environment Variables

Create a `.env` file inside the `server/` directory:

```
PORT=5000
MONGO_URI=your_mongodb_connection_uri
JWT_SECRET=your_jwt_secret_key
```

### 3. Run the Backend

```bash
cd server
npm install
npm run dev
```

The backend server will start at `http://localhost:5000`.

### 4. Run the Frontend

Open a new terminal window:

```bash
cd client
npm install
npm run dev
```

The frontend will start at `http://localhost:5173`.

### 5. Seed Demo Data (Optional)

Populate the database with 8 demo users, 6 projects, and 30 tasks:

```bash
cd server
npm run seed
```

> **Warning:** The seed script clears all existing data before inserting fresh demo records.

---

## Demo Credentials

After running the seed script, use any of the following accounts to log in:

| Name          | Email                  | Password |
|---------------|------------------------|----------|
| Alice Smith   | alice@example.com      | 123456   |
| Bob Jones     | bob@example.com        | 123456   |
| Charlie Brown | charlie@example.com    | 123456   |
| Diana Prince  | diana@example.com      | 123456   |

---

## Future Improvements

- **Drag-and-drop Kanban** — Reorder tasks between status columns via drag and drop
- **Real-time Collaboration** — Live updates using WebSocket / Socket.io
- **File Attachments** — Upload and attach files to tasks
- **Notifications** — In-app and email alerts for assignments and comments
- **Calendar View** — Visualize task deadlines in a monthly calendar

---

## License

This project was developed for educational purposes as part of the CodeAlpha Internship Program.