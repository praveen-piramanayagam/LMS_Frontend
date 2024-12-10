import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token'); // Assuming token is stored in localStorage

  // If there's no token, redirect to login page
  if (!token) {
    return <Navigate to="/login" />;
  }

  return children; // If authenticated, render the child components
};

export default PrivateRoute;
