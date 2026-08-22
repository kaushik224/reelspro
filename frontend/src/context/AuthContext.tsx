import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, RegisterRequest } from '@/types';
import { authService } from '@/services/authService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  expiresAt: string | null;
  login: (credentials: RegisterRequest) => Promise<void>;
  register: (credentials: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  refetchSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchSession = useCallback(async () => {
    try {
      setIsLoading(true);
      const session = await authService.getSession();

      if (session?.user && session.user.email) {
        // Check if session expiry has passed
        if (session.expires && new Date(session.expires).getTime() < Date.now()) {
          setUser(null);
          setExpiresAt(null);
        } else {
          setUser(session.user);
          setExpiresAt(session.expires || null);
        }
      } else {
        setUser(null);
        setExpiresAt(null);
      }
    } catch {
      setUser(null);
      setExpiresAt(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  const login = async (credentials: RegisterRequest) => {
    await authService.login(credentials);
    await fetchSession();
  };

  const register = async (credentials: RegisterRequest) => {
    await authService.register(credentials);
    await login(credentials);
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    setExpiresAt(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        expiresAt,
        login,
        register,
        logout,
        refetchSession: fetchSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
