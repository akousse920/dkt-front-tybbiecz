import React from 'react';
import { Navigate } from 'react-router-dom';

interface PrivateRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, adminOnly = false }) => {
  const token = localStorage.getItem('token');
  // In a real app, you'd decode the JWT to check user role
  const isAdmin = true; // This should be determined from the token

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/orders" replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;