import React from 'react';
import { useLocation, Navigate, Outlet } from 'react-router-dom';
import useAuth from '../../Hooks/useAuth';

export default function RequireAuth() {
    const { auth } = useAuth();
    const location = useLocation();

    return (
        auth?.user
            ? <Outlet />
            : <Navigate to='/auth/login' state={{ from: location }} replace />
  );
}
