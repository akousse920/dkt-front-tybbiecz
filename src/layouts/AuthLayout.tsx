import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';

const AuthLayout = () => {
  const token = localStorage.getItem('token');

  // If user is already authenticated, redirect to orders page
  if (token) {
    return <Navigate to="/orders" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Outlet />
    </div>
  );
};

export default AuthLayout;