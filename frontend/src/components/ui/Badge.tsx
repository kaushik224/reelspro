import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'rose' | 'zinc' | 'emerald' | 'amber';
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'rose' }) => {
  const variantStyles = {
    rose: 'bg-rose-950/60 border-rose-800/40 text-rose-300',
    zinc: 'bg-zinc-800/60 border-zinc-700/40 text-zinc-300',
    emerald: 'bg-emerald-950/60 border-emerald-800/40 text-emerald-300',
    amber: 'bg-amber-950/60 border-amber-800/40 text-amber-300',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${variantStyles[variant]}`}
    >
      {children}
    </span>
  );
};
