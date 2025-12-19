import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import api from '../api';
import 'bootstrap-icons/font/bootstrap-icons.css';

const Navbar = () => {
    const [user, setUser] = useState(null);
    const location = useLocation();

    // 1. Get the API URL from the environment (or default to localhost)
    const API_URL = process.env.REACT_APP_API_URL || 'https://localhost:8080/api';

    // 2. Derive the Root URL (Remove '/api' from the end)
    // If API is 'https://localhost:8080/api', this becomes 'https://localhost:8080'
    const SERVER_URL = API_URL.replace('/api', '');

    useEffect(() => {
        api.get('/auth/me')
            .then(res => setUser(res.data))
            .catch(() => setUser(null));
    }, []);

    const homeLink = user?.role === 'ADMIN' ? '/admin-dashboard' : user?.role === 'DOCTOR' ? '/doctor-dashboard' : '/';
    const isActive = (path) => location.pathname === path ? 'active fw-bold' : '';

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm sticky-top" style={{ background: 'linear-gradient(90deg, #0d6efd 0%, #0a58ca 100%)' }}>
            <div className="container">
                <Link className="navbar-brand d-flex align-items-center fw-bold" to={homeLink}>
                    <i className="bi bi-heart-pulse-fill me-2 fs-4"></i>
                    Smart Hospital
                </Link>

                <div className="d-flex align-items-center">
                    <Link className={`nav-link text-white me-3 ${isActive(homeLink)}`} to={homeLink}>
                        <i className="bi bi-house-door me-1"></i>
                        {user?.role === 'ADMIN' ? 'Admin Panel' : user?.role === 'DOCTOR' ? 'Dashboard' : 'Home'}
                    </Link>

                    {user?.role === 'PATIENT' && (
                        <Link className={`nav-link text-white me-3 ${isActive('/my-appointments')}`} to="/my-appointments">
                            <i className="bi bi-calendar-check me-1"></i> History
                        </Link>
                    )}

                    {user ? (
                        <div className="d-flex align-items-center bg-white bg-opacity-25 rounded-pill px-3 py-1">
                            <i className="bi bi-person-circle text-white me-2"></i>
                            <span className="text-white me-3 small text-uppercase fw-bold">{user.username}</span>

                            {/* DYNAMIC LOGOUT LINK */}
                            <a className="btn btn-sm btn-light text-primary fw-bold rounded-pill" href={`${SERVER_URL}/logout`}>
                                Logout
                            </a>
                        </div>
                    ) : (
                        /* DYNAMIC LOGIN LINK */
                        <a className="btn btn-light rounded-pill px-4 fw-bold" href={`${SERVER_URL}/login`}>
                            Login
                        </a>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;