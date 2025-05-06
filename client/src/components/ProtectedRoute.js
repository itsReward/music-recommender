import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);

    // Show loading indicator while checking authentication
    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    // Redirect to login if not authenticated
    if (!user) {
        return <Navigate to="/login" />;
    }

    // Render the protected component if authenticated
    return children;
};

export default ProtectedRoute;