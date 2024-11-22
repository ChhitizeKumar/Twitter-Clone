import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

interface ProtectedRouteProps {
    redirectPath: string;
    shouldRedirect: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ redirectPath, shouldRedirect }) => {
    const userId = localStorage.getItem('userId');

    if (shouldRedirect && !userId) {
        // Redirect to login if the user is not logged in
        return <Navigate to={redirectPath} replace />;
    }

    if (!shouldRedirect && userId) {
        // Redirect to home if the user is logged in and trying to access login/signup
        return <Navigate to="/home" replace />;
    }

    // Render the child routes if the conditions are met
    return <Outlet />;
};

export default ProtectedRoute;
