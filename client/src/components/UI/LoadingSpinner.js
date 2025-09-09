import React from 'react';
import { cn } from '../../utils/cn';

const LoadingSpinner = ({ 
  size = 'md', 
  className = '', 
  color = 'primary' 
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12'
  };

  const colorClasses = {
    primary: 'border-primary-600',
    white: 'border-white',
    gray: 'border-gray-600',
    success: 'border-green-600',
    danger: 'border-red-600'
  };

  return (
    <div
      className={cn(
        'animate-spin rounded-full border-2 border-t-transparent',
        sizeClasses[size],
        colorClasses[color],
        className
      )}
    />
  );
};

export default LoadingSpinner;
