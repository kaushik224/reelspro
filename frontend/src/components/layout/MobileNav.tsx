import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Compass, Upload, Lock } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export const MobileNav: React.FC = () => {
  const { isAuthenticated } = useAuth();

  const items = [
    { label: 'Home', path: '/', icon: Home, public: true },
    { label: 'Explore', path: '/explore', icon: Compass, public: true },
    { label: 'Reels', path: '/reels', icon: Home, public: true },
    { label: 'Upload', path: '/upload', icon: Upload, public: false },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-zinc-950/95 backdrop-blur-lg border-t border-zinc-800/80 px-2 py-2">
      <div className="flex items-center justify-around">
        {items.map((item) => {
          const Icon = item.icon;
          const isLocked = !item.public && !isAuthenticated;
          
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl text-[11px] font-medium transition-all ${
                  isActive
                    ? 'text-rose-400 font-bold'
                    : 'text-zinc-400 hover:text-zinc-200'
                } ${isLocked ? 'opacity-50' : ''}`
              }
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                {isLocked && (
                  <Lock className="w-2.5 h-2.5 text-zinc-500 absolute -top-1 -right-1" />
                )}
              </div>
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
