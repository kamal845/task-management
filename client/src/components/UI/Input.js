import React, { forwardRef } from 'react';
import { cn } from '../../utils/cn';

const Input = forwardRef(({
  type = 'text',
  placeholder = '',
  disabled = false,
  required = false,
  className = '',
  error = false,
  errorMessage = '',
  label = '',
  id,
  name,
  ...props
}, ref) => {
  const inputId = id || name;

  return (
    <div className="w-full">
      {label && (
        <label 
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        ref={ref}
        type={type}
        id={inputId}
        name={name}
        disabled={disabled}
        required={required}
        placeholder={placeholder}
        className={cn(
          'input',
          error && 'border-red-500 focus-visible:ring-red-500',
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
        {...props} // React Hook Form ke props yahin spread honge
      />
      {error && errorMessage && (
        <p className="mt-1 text-sm text-red-600">{errorMessage}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
