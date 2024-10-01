import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate  } from 'react-router-dom';
import useIsAuthenticated from '../../hooks/useAuthentication';

const PrivateRoute = ({ children }) => {
  // Check if user is authenticated
  const isAuthenticated = useIsAuthenticated();

  return isAuthenticated ? (
    children
  ) : (
    <Navigate to="/login" replace />
  );
};

export default PrivateRoute;