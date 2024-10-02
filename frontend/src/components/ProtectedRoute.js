import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('access_token');

  if (!token) {
    // Redirect to login if token is not present
    return <Navigate to="/login" />;
  }

  return children;  // If token is present, render the protected component
};

export default ProtectedRoute;
