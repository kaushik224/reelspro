import React from 'react';

interface AvatarProps {
  email?: string;
  src?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Avatar: React.FC<AvatarProps> = ({ email, src, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-12 h-12 text-base font-semibold',
  };

  const getInitials = (emailStr?: string) => {
    if (!emailStr) return 'U';
    return emailStr.charAt(0).toUpperCase();
  };

  if (src) {
    return (
      <img
        src={src}
        alt={email || 'User Avatar'}
        className={`rounded-full object-cover border border-zinc-700/60 ${sizeClasses[size]}`}
      />
    );
  }

  return (
    <div
      className={`rounded-full bg-gradient-to-tr from-rose-600 to-pink-600 text-white font-bold flex items-center justify-center border border-rose-400/30 shadow-md ${sizeClasses[size]}`}
    >
      {getInitials(email)}
    </div>
  );
};
