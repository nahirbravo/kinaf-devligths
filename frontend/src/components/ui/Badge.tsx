'use client';

import { clsx } from 'clsx';
import { HTMLAttributes } from 'react';

type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info';
type BadgeSize = 'sm' | 'md';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
}

const variants: Record<BadgeVariant, string> = {
  default: 'bg-[var(--gray-100)] text-[var(--gray-700)]',
  primary: 'bg-[var(--primary-50)] text-[var(--primary-700)]',
  success: 'bg-[var(--success-50)] text-[var(--success-700)]',
  warning: 'bg-[var(--warning-50)] text-[var(--warning-600)]',
  error: 'bg-[var(--error-50)] text-[var(--error-700)]',
  info: 'bg-blue-50 text-blue-700',
};

const sizes: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
};

const dotColors: Record<BadgeVariant, string> = {
  default: 'bg-[var(--gray-500)]',
  primary: 'bg-[var(--primary-500)]',
  success: 'bg-[var(--success-500)]',
  warning: 'bg-[var(--warning-500)]',
  error: 'bg-[var(--error-500)]',
  info: 'bg-blue-500',
};

export function Badge({
  className,
  variant = 'default',
  size = 'sm',
  dot = false,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 font-medium rounded-full whitespace-nowrap',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {dot && (
        <span className={clsx('w-1.5 h-1.5 rounded-full', dotColors[variant])} />
      )}
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const statusConfig: Record<string, { variant: BadgeVariant; label: string }> = {
    pending: { variant: 'warning', label: 'Pendiente' },
    confirmed: { variant: 'success', label: 'Confirmado' },
    cancelled: { variant: 'error', label: 'Cancelado' },
    completed: { variant: 'info', label: 'Completado' },
  };

  const config = statusConfig[status] || { variant: 'default', label: status };

  return (
    <Badge variant={config.variant} dot>
      {config.label}
    </Badge>
  );
}
