import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  hoverable = false,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-6 backdrop-blur-sm transition-all duration-200 ${
        hoverable ? 'hover:border-zinc-700 hover:shadow-xl hover:shadow-rose-950/20 hover:-translate-y-0.5' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
