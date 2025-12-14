import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import api from '../api';

const ProtectedRoute = ({ children, roleRequired }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/auth/me')
            .then(res => {
                setUser(res.data);
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    }, []);

    if (loading) return <div>Loading...</div>;

    // If not logged in, or role doesn't match
    if (!user || (roleRequired && user.role !== roleRequired)) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;