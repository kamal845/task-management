import axios from 'axios';

// Create axios instance
// Create axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://task-management-lake-sigma.vercel.app/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
      window.location.href = '/login';
    } else if (error.response?.status === 403) {
      // Forbidden
      console.error('Access forbidden');
    } else if (error.response?.status >= 500) {
      // Server error
      console.error('Server error:', error.response?.data?.message);
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = api;

// Task API
export const taskAPI = {
  // Get all tasks
  getTasks: (params = {}) => api.get('/tasks', { params }),
  
  // Get single task
  getTask: (id) => api.get(`/tasks/${id}`),
  
  // Create task
  createTask: (data) => api.post('/tasks', data),
  
  // Update task
  updateTask: (id, data) => api.put(`/tasks/${id}`, data),
  
  // Delete task
  deleteTask: (id) => api.delete(`/tasks/${id}`),
  
  // Get task stats
  getTaskStats: () => api.get('/tasks/stats'),
  
  // Search tasks
  searchTasks: (params) => api.get('/tasks/search', { params }),
  
  // Get tasks by status
  getTasksByStatus: (status, params = {}) => api.get(`/tasks/status/${status}`, { params }),
  
  // Get overdue tasks
  getOverdueTasks: (params = {}) => api.get('/tasks/overdue', { params }),
  
  // Archive task
  archiveTask: (id) => api.patch(`/tasks/${id}/archive`),
  
  // Unarchive task
  unarchiveTask: (id) => api.patch(`/tasks/${id}/unarchive`),
};

// User API
export const userAPI = {
  // Get user profile
  getProfile: () => api.get('/users/me'),
  
  // Update user profile
  updateProfile: (data) => api.put('/users/me', data),
  
  // Get user stats
  getUserStats: () => api.get('/users/stats'),
  
  // Get all users (admin only)
  getUsers: (params = {}) => api.get('/users', { params }),
  
  // Get single user
  getUser: (id) => api.get(`/users/${id}`),
  
  // Delete user (admin only)
  deleteUser: (id) => api.delete(`/users/${id}`),
  
  // Update user role (admin only)
  updateUserRole: (id, data) => api.patch(`/users/${id}/role`, data),
};

// Utility functions
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    return error.response.data.message || 'An error occurred';
  } else if (error.request) {
    // Request was made but no response received
    return 'Network error. Please check your connection.';
  } else {
    // Something else happened
    return error.message || 'An unexpected error occurred';
  }
};

export default api;
