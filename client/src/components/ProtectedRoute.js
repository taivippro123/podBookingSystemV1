import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles.includes(user.userRole)) {
        return children;
    } else {
        return <Navigate to="/" replace />;
    }
};

export default ProtectedRoute;