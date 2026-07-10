import React from 'react';
import { Link } from 'react-router-dom';
import { FileQuestion, Home } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6">
      <div className="bg-zinc-900/80 p-5 rounded-3xl border border-zinc-800 mb-6 shadow-2xl">
        <FileQuestion className="w-16 h-16 text-rose-500" />
      </div>
      <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">404 - Page Not Found</h1>
      <p className="text-zinc-400 max-w-md mb-8 text-sm leading-relaxed">
        The page or reel route you are looking for does not exist or has been moved.
      </p>
      <Link to="/">
        <Button variant="primary" leftIcon={<Home className="w-4 h-4" />}>
          Back to Home
        </Button>
      </Link>
    </div>
  );
};
