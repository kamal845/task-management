# Task Management App

A full-stack task management application built with the MERN stack (MongoDB, Express.js, React, Node.js). This application allows users to register, log in, and manage their tasks with features like CRUD operations, search, filtering, and pagination.

## 🚀 Features

### Authentication
- ✅ User registration and login
- ✅ Secure password hashing with bcrypt
- ✅ JWT-based authentication
- ✅ Protected routes and user-specific data access
- ✅ Account lockout after failed login attempts

### Task Management
- ✅ Create, read, update, and delete tasks
- ✅ Task status management (Pending, In Progress, Completed)
- ✅ Priority levels (Low, Medium, High)
- ✅ Due date tracking with overdue detection
- ✅ Tags for better organization
- ✅ Task archiving functionality

### Advanced Features
- ✅ Real-time search across task titles and descriptions
- ✅ Advanced filtering by status, priority, and date
- ✅ Pagination for better performance
- ✅ Responsive design for all devices
- ✅ Modern UI with Tailwind CSS
- ✅ Optimistic updates for better UX
- ✅ Comprehensive error handling
- ✅ Loading states and user feedback

### Dashboard & Analytics
- ✅ Task statistics and overview
- ✅ Recent tasks display
- ✅ Overdue tasks highlighting
- ✅ Quick action buttons
- ✅ User profile management

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Express Validator** - Input validation
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing
- **Morgan** - HTTP request logger

### Frontend
- **React 18** - UI library
- **React Router DOM** - Client-side routing
- **React Query** - Data fetching and caching
- **React Hook Form** - Form management
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **React Hot Toast** - Notifications
- **Date-fns** - Date utilities
- **React DatePicker** - Date input component

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### 1. Clone the repository
```bash
git clone <repository-url>
cd taskmanagement
```

### 2. Install dependencies
```bash
# Install root dependencies
npm install

# Install server dependencies
npm run install-server

# Install client dependencies
npm run install-client
```

### 3. Environment Setup

#### Server Environment
Create a `.env` file in the `server` directory:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/taskmanagement
# For production, use MongoDB Atlas connection string
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/taskmanagement

# JWT
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_secure
JWT_EXPIRE=7d

# Server
PORT=5000
NODE_ENV=development

# CORS
CLIENT_URL=http://localhost:3000
```

#### Client Environment
Create a `.env` file in the `client` directory:

```env
REACT_APP_API_URL=http://localhost:4000/api
```

### 4. Run the application

#### Development Mode
```bash
# Run both server and client concurrently
npm run dev

# Or run separately:
# Server (Terminal 1)
npm run server

# Client (Terminal 2)
npm run client
```

#### Production Mode
```bash
# Build the client
npm run build

# Start the server
npm start
```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/update-profile` - Update user profile
- `PUT /api/auth/update-password` - Update password

### Tasks
- `GET /api/tasks` - Get all tasks (with pagination, search, filters)
- `GET /api/tasks/:id` - Get single task
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `GET /api/tasks/stats` - Get task statistics
- `GET /api/tasks/search` - Search tasks
- `GET /api/tasks/status/:status` - Get tasks by status
- `GET /api/tasks/overdue` - Get overdue tasks

### Users (Admin only)
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get single user
- `DELETE /api/users/:id` - Delete user
- `PATCH /api/users/:id/role` - Update user role

## 🚀 Deployment

### Vercel + MongoDB Atlas

#### 1. Deploy Backend to Vercel
1. Create a new project on Vercel
2. Connect your GitHub repository
3. Set build command: `cd server && npm install && npm run build`
4. Set output directory: `server`
5. Add environment variables in Vercel dashboard

#### 2. Deploy Frontend to Vercel
1. Create another Vercel project for the frontend
2. Set build command: `cd client && npm install && npm run build`
3. Set output directory: `client/build`
4. Add environment variables:
   - `REACT_APP_API_URL=https://your-backend-url.vercel.app/api`

#### 3. MongoDB Atlas Setup
1. Create a MongoDB Atlas account
2. Create a new cluster
3. Create a database user
4. Whitelist your IP addresses
5. Get the connection string and update `MONGODB_URI`

### Environment Variables for Production

#### Backend (.env)
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/taskmanagement
JWT_SECRET=your_production_jwt_secret_key
JWT_EXPIRE=7d
PORT=5000
NODE_ENV=production
CLIENT_URL=https://your-frontend-url.vercel.app
```

#### Frontend (.env)
```env
REACT_APP_API_URL=https://your-backend-url.vercel.app/api
```

## 🧪 Testing

```bash
# Run server tests
cd server
npm test

# Run client tests
cd client
npm test
```

## 📱 Usage

### Getting Started
1. Register a new account or login with existing credentials
2. Create your first task using the "New Task" button
3. Use the dashboard to get an overview of your tasks
4. Filter and search tasks as needed
5. Update task status and priority as you work
6. Set due dates to track deadlines

### Task Management
- **Create Tasks**: Add title, description, priority, due date, and tags
- **Update Tasks**: Edit any task details or change status
- **Delete Tasks**: Remove tasks you no longer need
- **Search**: Find tasks by title, description, or tags
- **Filter**: View tasks by status or priority
- **Sort**: Organize tasks by date, title, or priority

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Rate limiting to prevent abuse
- Input validation and sanitization
- CORS configuration
- Helmet for security headers
- Account lockout after failed attempts
- Protected routes and user-specific data access

## 🎨 UI/UX Features

- Responsive design for all devices
- Modern and clean interface
- Loading states and error handling
- Toast notifications for user feedback
- Optimistic updates for better performance
- Accessible form controls
- Intuitive navigation and user flow

## 📊 Performance Optimizations

- React Query for efficient data fetching
- Pagination to handle large datasets
- Optimistic updates for immediate feedback
- Image optimization and lazy loading
- Code splitting and bundle optimization
- Caching strategies for better performance

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Ved**
- GitHub: [@ved](https://github.com/ved)
- Email: ved@example.com

## 🙏 Acknowledgments

- React team for the amazing framework
- Express.js for the robust backend framework
- MongoDB for the flexible database
- Tailwind CSS for the utility-first CSS framework
- All the open-source contributors who made this project possible

---

**Note**: This is a production-ready application built for interview purposes. It includes comprehensive error handling, security measures, and follows industry best practices for MERN stack development.
