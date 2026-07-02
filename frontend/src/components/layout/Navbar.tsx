import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PlaySquare, LogOut, LogIn, UserPlus, Upload } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      showToast('You have been logged out.', 'info');
      navigate('/');
    } catch {
      showToast('Error signing out. Please try again.', 'error');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800/80 px-4 lg:px-8 py-3 transition-all duration-200">
      <div className="flex items-center justify-between max-w-7xl mx-auto gap-4">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="bg-gradient-to-tr from-rose-600 to-pink-600 p-2 rounded-xl text-white shadow-lg shadow-rose-950/40 group-hover:scale-105 transition-transform duration-200">
            <PlaySquare className="w-5 h-5 fill-white/20" />
          </div>
          <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
            Reels<span className="text-rose-500">Pro</span>
          </span>
        </Link>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Link to="/upload">
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<Upload className="w-4 h-4" />}
                >
                  Upload
                </Button>
              </Link>

              <div className="flex items-center gap-3 pl-2 border-l border-zinc-800">
                <Avatar email={user?.email} size="sm" />
                <span className="hidden sm:inline text-xs font-semibold text-zinc-200 truncate max-w-[140px]">
                  {user?.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="p-1.5 text-zinc-400 hover:text-rose-400 hover:bg-rose-950/40 rounded-lg transition-colors"
                  title="Log Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<LogIn className="w-4 h-4" />}
                onClick={() => navigate('/login')}
              >
                Log In
              </Button>
              <Button
                variant="primary"
                size="sm"
                leftIcon={<UserPlus className="w-4 h-4" />}
                onClick={() => navigate('/register')}
              >
                Register
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
