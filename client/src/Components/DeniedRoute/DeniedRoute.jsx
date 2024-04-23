import React from 'react';
import { useLocation, Navigate, Outlet } from 'react-router-dom';
import useAuth from '../../Hooks/useAuth';

export default function DeniedRoute() {
    const { auth } = useAuth();
    const location = useLocation();

    return (
        auth?.user
            ? <Navigate to='/' state={{ from: location }} replace />
            : <Outlet />
    );
}
