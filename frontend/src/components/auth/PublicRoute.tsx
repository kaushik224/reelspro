import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface PublicRouteProps {
  children: React.ReactNode;
  restrictedToGuest?: boolean;
}

export const PublicRoute: React.FC<PublicRouteProps> = ({
  children,
  restrictedToGuest = false,
}) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (restrictedToGuest && !isLoading && isAuthenticated) {
    const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/';
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
};
