import React from 'react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'rose' | 'white' | 'zinc';
  label?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  color = 'rose',
  label,
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  const colorClasses = {
    rose: 'border-rose-500/20 border-t-rose-500',
    white: 'border-white/20 border-t-white',
    zinc: 'border-zinc-700 border-t-zinc-300',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className={`rounded-full animate-spin ${sizeClasses[size]} ${colorClasses[color]}`}
        role="status"
        aria-label={label || 'Loading'}
      />
      {label && <p className="text-sm font-medium text-zinc-400">{label}</p>}
    </div>
  );
};
