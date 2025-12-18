'use client';

import { clsx } from 'clsx';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={clsx('text-center py-12 px-4', className)}>
      {icon && (
        <div className="mx-auto w-12 h-12 rounded-full bg-[var(--gray-100)] flex items-center justify-center text-[var(--gray-400)] mb-4">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-[var(--gray-900)] mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-[var(--gray-500)] max-w-sm mx-auto mb-4">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
