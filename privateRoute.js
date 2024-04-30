import React from 'react';
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import SessionStorageListener from './sessionStorageListener';

const PrivateRoute = () => {
  const isAuthenticated = useSelector((state) => state.login.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <SessionStorageListener /> 
      <Outlet />
    </>
  );
};

export default PrivateRoute;
