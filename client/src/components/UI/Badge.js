import React from 'react';
import { cn } from '../../utils/cn';

const Badge = ({ 
  children, 
  variant = 'default', 
  size = 'md',
  className = '',
  ...props 
}) => {
  const baseClasses = 'badge inline-flex items-center font-medium';
  
  const variantClasses = {
    default: 'badge-default',
    secondary: 'badge-secondary',
    success: 'badge-success',
    warning: 'badge-warning',
    danger: 'badge-danger',
    outline: 'badge-outline'
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-xs',
    lg: 'px-3 py-1 text-sm'
  };

  return (
    <span
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

// Status badge for tasks
export const StatusBadge = ({ status, className = '' }) => {
  const statusConfig = {
    pending: {
      variant: 'warning',
      label: 'Pending',
      icon: '⏳'
    },
    'in-progress': {
      variant: 'default',
      label: 'In Progress',
      icon: '🔄'
    },
    completed: {
      variant: 'success',
      label: 'Completed',
      icon: '✅'
    }
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <Badge variant={config.variant} className={className}>
      <span className="mr-1">{config.icon}</span>
      {config.label}
    </Badge>
  );
};

// Priority badge for tasks
export const PriorityBadge = ({ priority, className = '' }) => {
  const priorityConfig = {
    low: {
      variant: 'secondary',
      label: 'Low',
      icon: '🟢'
    },
    medium: {
      variant: 'default',
      label: 'Medium',
      icon: '🟡'
    },
    high: {
      variant: 'danger',
      label: 'High',
      icon: '🔴'
    }
  };

  const config = priorityConfig[priority] || priorityConfig.medium;

  return (
    <Badge variant={config.variant} className={className}>
      <span className="mr-1">{config.icon}</span>
      {config.label}
    </Badge>
  );
};

export default Badge;
