// Email validation
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation
export const isValidPassword = (password) => {
  // At least 6 characters, one lowercase, one uppercase, one number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{6,}$/;
  return passwordRegex.test(password);
};

// Name validation
export const isValidName = (name) => {
  // Only letters and spaces, 2-50 characters
  const nameRegex = /^[a-zA-Z\s]{2,50}$/;
  return nameRegex.test(name);
};

// Task title validation
export const isValidTaskTitle = (title) => {
  return title && title.trim().length >= 1 && title.trim().length <= 100;
};

// Task description validation
export const isValidTaskDescription = (description) => {
  return description && description.trim().length >= 1 && description.trim().length <= 500;
};

// Get password strength
export const getPasswordStrength = (password) => {
  if (!password) return { score: 0, label: 'Very Weak' };
  
  let score = 0;
  const checks = {
    length: password.length >= 6,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  };
  
  Object.values(checks).forEach(check => {
    if (check) score++;
  });
  
  const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
  return {
    score,
    label: labels[score],
    checks
  };
};

// Validate form data
export const validateForm = (data, rules) => {
  const errors = {};
  
  Object.keys(rules).forEach(field => {
    const value = data[field];
    const rule = rules[field];
    
    // Required validation
    if (rule.required && (!value || value.toString().trim() === '')) {
      errors[field] = rule.required;
      return;
    }
    
    // Skip other validations if field is empty and not required
    if (!value || value.toString().trim() === '') return;
    
    // Min length validation
    if (rule.minLength && value.length < rule.minLength) {
      errors[field] = rule.minLength;
      return;
    }
    
    // Max length validation
    if (rule.maxLength && value.length > rule.maxLength) {
      errors[field] = rule.maxLength;
      return;
    }
    
    // Pattern validation
    if (rule.pattern && !rule.pattern.test(value)) {
      errors[field] = rule.pattern;
      return;
    }
    
    // Custom validation
    if (rule.validate && !rule.validate(value)) {
      errors[field] = rule.custom;
      return;
    }
  });
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Common validation rules
export const validationRules = {
  email: {
    required: 'Email is required',
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    custom: 'Please enter a valid email address'
  },
  password: {
    required: 'Password is required',
    minLength: 6,
    custom: 'Password must be at least 6 characters'
  },
  name: {
    required: 'Name is required',
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-Z\s]+$/,
    custom: 'Name can only contain letters and spaces'
  },
  taskTitle: {
    required: 'Task title is required',
    minLength: 1,
    maxLength: 100,
    custom: 'Title must be between 1 and 100 characters'
  },
  taskDescription: {
    required: 'Task description is required',
    minLength: 1,
    maxLength: 500,
    custom: 'Description must be between 1 and 500 characters'
  }
};
