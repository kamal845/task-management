import React from 'react';
import { cn } from '../../utils/cn';

const Card = ({ children, className = '', ...props }) => {
  return (
    <div
      className={cn('card', className)}
      {...props}
    >
      {children}
    </div>
  );
};

const CardHeader = ({ children, className = '', ...props }) => {
  return (
    <div
      className={cn('card-header', className)}
      {...props}
    >
      {children}
    </div>
  );
};

const CardTitle = ({ children, className = '', ...props }) => {
  return (
    <h3
      className={cn('card-title', className)}
      {...props}
    >
      {children}
    </h3>
  );
};

const CardDescription = ({ children, className = '', ...props }) => {
  return (
    <p
      className={cn('card-description', className)}
      {...props}
    >
      {children}
    </p>
  );
};

const CardContent = ({ children, className = '', ...props }) => {
  return (
    <div
      className={cn('card-content', className)}
      {...props}
    >
      {children}
    </div>
  );
};

const CardFooter = ({ children, className = '', ...props }) => {
  return (
    <div
      className={cn('card-footer', className)}
      {...props}
    >
      {children}
    </div>
  );
};

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
