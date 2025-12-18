'use client';

import { InputHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, leftIcon, rightIcon, id, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).slice(2, 9)}`;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-[var(--gray-700)] mb-1.5"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--gray-400)]">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={clsx(
              'w-full px-3.5 py-2.5 text-sm rounded-lg border bg-white text-[var(--gray-900)]',
              'transition-all duration-[var(--transition-fast)]',
              'placeholder:text-[var(--gray-400)]',
              'focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)] focus:ring-offset-0 focus:border-[var(--primary-500)]',
              'disabled:bg-[var(--gray-50)] disabled:text-[var(--gray-400)] disabled:cursor-not-allowed',
              error
                ? 'border-[var(--error-500)] focus:ring-[var(--error-500)] focus:border-[var(--error-500)]'
                : 'border-[var(--gray-200)] hover:border-[var(--gray-300)]',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--gray-400)]">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p className="mt-1.5 text-sm text-[var(--error-600)]">{error}</p>
        )}
        {hint && !error && (
          <p className="mt-1.5 text-sm text-[var(--gray-500)]">{hint}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

interface SelectProps extends InputHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, id, ...props }, ref) => {
    const selectId = id || `select-${Math.random().toString(36).slice(2, 9)}`;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-sm font-medium text-[var(--gray-700)] mb-1.5"
          >
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={clsx(
            'w-full px-3.5 py-2.5 text-sm rounded-lg border bg-white text-[var(--gray-900)]',
            'transition-all duration-[var(--transition-fast)]',
            'focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)] focus:ring-offset-0 focus:border-[var(--primary-500)]',
            'disabled:bg-[var(--gray-50)] disabled:text-[var(--gray-400)] disabled:cursor-not-allowed',
            error
              ? 'border-[var(--error-500)]'
              : 'border-[var(--gray-200)] hover:border-[var(--gray-300)]',
            className
          )}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && (
          <p className="mt-1.5 text-sm text-[var(--error-600)]">{error}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
