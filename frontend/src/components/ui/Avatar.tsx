'use client';

import { clsx } from 'clsx';

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: AvatarSize;
  className?: string;
}

const sizes: Record<AvatarSize, string> = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
};

const colors = [
  'bg-[var(--primary-100)] text-[var(--primary-700)]',
  'bg-[var(--success-100)] text-[var(--success-700)]',
  'bg-purple-100 text-purple-700',
  'bg-pink-100 text-pink-700',
  'bg-indigo-100 text-indigo-700',
  'bg-teal-100 text-teal-700',
];

function getInitials(name: string): string {
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

function getColorFromName(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

export function Avatar({ src, alt, name, size = 'md', className }: AvatarProps) {
  const initials = name ? getInitials(name) : '?';
  const bgColor = name ? getColorFromName(name) : colors[0];

  if (src) {
    return (
      <img
        src={src}
        alt={alt || name || 'Avatar'}
        className={clsx(
          'rounded-full object-cover ring-2 ring-white',
          sizes[size],
          className
        )}
      />
    );
  }

  return (
    <div
      className={clsx(
        'rounded-full flex items-center justify-center font-semibold ring-2 ring-white',
        sizes[size],
        bgColor,
        className
      )}
      title={name}
    >
      {initials}
    </div>
  );
}

interface AvatarGroupProps {
  avatars: { name?: string; src?: string }[];
  max?: number;
  size?: AvatarSize;
}

export function AvatarGroup({ avatars, max = 4, size = 'sm' }: AvatarGroupProps) {
  const visible = avatars.slice(0, max);
  const remaining = avatars.length - max;

  return (
    <div className="flex -space-x-2">
      {visible.map((avatar, i) => (
        <Avatar key={i} {...avatar} size={size} />
      ))}
      {remaining > 0 && (
        <div
          className={clsx(
            'rounded-full flex items-center justify-center font-semibold bg-[var(--gray-100)] text-[var(--gray-600)] ring-2 ring-white',
            sizes[size]
          )}
        >
          +{remaining}
        </div>
      )}
    </div>
  );
}
