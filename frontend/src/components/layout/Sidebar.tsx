import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Compass, Upload, Lock } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Badge } from '@/components/ui/Badge';

export const Sidebar: React.FC = () => {
  const { isAuthenticated } = useAuth();

  const navItems = [
    { label: 'Home Feed', path: '/', icon: Home, public: true },
    { label: 'Explore', path: '/explore', icon: Compass, public: true },
    { label: 'Reels', path: '/reels', icon: Home, public: true },
    { label: 'Upload', path: '/upload', icon: Upload, public: false },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 shrink-0 border-r border-zinc-800/80 p-4 space-y-6 min-h-[calc(100vh-61px)] bg-zinc-950/40">
      <div className="space-y-1">
        <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-zinc-500 mb-2">
          Navigation
        </p>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isLocked = !item.public && !isAuthenticated;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20 font-semibold shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/60'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </div>
              {isLocked && (
                <span title="Login Required">
                  <Lock className="w-3.5 h-3.5 text-zinc-600" />
                </span>
              )}
            </NavLink>
          );
        })}
      </div>

      <div className="pt-4 border-t border-zinc-800/60">
        <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-zinc-500 mb-3">
          Platform Info
        </p>
        <div className="px-3 space-y-2 text-xs text-zinc-400">
          <div className="flex items-center justify-between">
            <span>Version</span>
            <Badge variant="zinc">v0.1.0-alpha</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span>API Status</span>
            <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Online
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};
