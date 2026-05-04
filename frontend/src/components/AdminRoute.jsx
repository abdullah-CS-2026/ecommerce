import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const AdminRoute = () => {
  const { isAdmin, loading } = useContext(AuthContext);

  if (loading) return null; // or a spinner

  return isAdmin ? <Outlet /> : <Navigate to="/" />;
};

export default AdminRoute;
