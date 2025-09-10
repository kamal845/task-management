# Task Management Web App

A simple Task Management Web Application built with **MERN stack** (MongoDB, Express.js, React/Next.js, Node.js) where users can register, log in, and manage their tasks.

---

## Features

### Authentication
- User Sign Up and Login using **email and password**.
- Passwords stored securely using **bcrypt hashing**.
- Authentication handled with **JWT**.
- Users can access **only their own tasks**.

### Task Management (CRUD)
- Create, Read, Update, Delete tasks.
- Each task has:
  - `title` (string)
  - `description` (string)
  - `status` (Pending / Done)
  - `createdAt` (timestamp)
- Only task creator can update/delete their tasks.

### Search, Filter, Pagination
- Search tasks by **title** or **description**.
- Filter tasks by **status**: All, Pending, Done.
- Search + Filter work together.
- Pagination included for better UX.

### Frontend
- Built with **Next.js 13+ (App Router)** or React.
- Pages:
  - Login/Register
  - Dashboard (Task List)
  - Task Form (Create/Edit)
- Clean UI using **TailwindCSS** or **Shadcn UI**.
- Loading and error states implemented.

---

## Local Setup

### Prerequisites
- Node.js >= 18
- MongoDB installed locally or use MongoDB Atlas
- npm / yarn

### Environment Variables
Create a `.env` file in the backend folder:
