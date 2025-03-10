import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface ProtectedRouteProps {
  requireAdmin?: boolean;
  requireStore?: boolean;
}

/**
 * Protected route component that redirects to login if user is not authenticated
 * or if they don't have the required role
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  requireAdmin = false,
  requireStore = false,
}) => {
  const { isAuthenticated, user, loading } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return <div>Loading...</div>;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if admin is required
  if (requireAdmin && !user?.isAdmin) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Check if store is required
  if (requireStore && !user?.store) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Render the child routes
  return <Outlet />;
};

export default ProtectedRoute; 