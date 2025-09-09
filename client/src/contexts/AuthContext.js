import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

// Auth reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        loading: false,
        isAuthenticated: !!action.payload,
      };
    case 'CLEAR_USER':
      return {
        ...state,
        user: null,
        loading: false,
        isAuthenticated: false,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

// Initial state
const initialState = {
  user: null,
  loading: true,
  isAuthenticated: false,
  error: null,
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load user on app start
  useEffect(() => {
    loadUser();
  }, []);

  // Load user from token
  const loadUser = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        dispatch({ type: 'SET_LOADING', payload: false });
        return;
      }

      // Set token in axios headers
      authAPI.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      const response = await authAPI.get('/auth/me');
      dispatch({ type: 'SET_USER', payload: response.data.data.user });
    } catch (error) {
      console.error('Load user error:', error);
      localStorage.removeItem('token');
      delete authAPI.defaults.headers.common['Authorization'];
      dispatch({ type: 'CLEAR_USER' });
    }
  };

  // Register user
  const register = async (userData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      console.log('Registering user with data:', userData);
      console.log('API base URL:', authAPI.defaults.baseURL);
      
      const response = await authAPI.post('/auth/register', userData);
      const { user, token } = response.data.data;

      // Store token
      localStorage.setItem('token', token);
      authAPI.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      dispatch({ type: 'SET_USER', payload: user });
      toast.success('Registration successful!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      dispatch({ type: 'SET_ERROR', payload: message });
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Login user
  const login = async (credentials) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      const response = await authAPI.post('/auth/login', credentials);
      const { user, token } = response.data.data;

      // Store token
      localStorage.setItem('token', token);
      authAPI.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      dispatch({ type: 'SET_USER', payload: user });
      toast.success('Login successful!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      dispatch({ type: 'SET_ERROR', payload: message });
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Logout user
  const logout = async () => {
    try {
      await authAPI.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear token and user data
      localStorage.removeItem('token');
      delete authAPI.defaults.headers.common['Authorization'];
      dispatch({ type: 'CLEAR_USER' });
      toast.success('Logged out successfully');
    }
  };

  // Update profile
  const updateProfile = async (profileData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      const response = await authAPI.put('/auth/update-profile', profileData);
      const { user } = response.data.data;

      dispatch({ type: 'SET_USER', payload: user });
      toast.success('Profile updated successfully!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Profile update failed';
      dispatch({ type: 'SET_ERROR', payload: message });
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Update password
  const updatePassword = async (passwordData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      const response = await authAPI.put('/auth/update-password', passwordData);
      const { token } = response.data.data;

      // Update token
      localStorage.setItem('token', token);
      authAPI.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      toast.success('Password updated successfully!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Password update failed';
      dispatch({ type: 'SET_ERROR', payload: message });
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value = {
    ...state,
    register,
    login,
    logout,
    updateProfile,
    updatePassword,
    clearError,
    loadUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
