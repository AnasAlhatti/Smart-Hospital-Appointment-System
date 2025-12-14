import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

const Navbar = () => {
    const [user, setUser] = useState(null);

    // Fetch the current user to know their role
    useEffect(() => {
        api.get('/auth/me')
            .then(res => setUser(res.data))
            .catch(() => setUser(null)); // If not logged in
    }, []);

    // Decide where the "Home" link goes
    const homeLink = user?.role === 'ADMIN' ? '/admin-dashboard' : user?.role === 'DOCTOR' ? '/doctor-dashboard' : '/';

    return (
        <nav className="navbar navbar-dark bg-primary mb-4">
            <div className="container">
                {/* 1. Dynamic Logo Link */}
                <Link className="navbar-brand" to={homeLink}>Smart Hospital</Link>

                <div>
                    {/* 2. Dynamic Home Button */}
                    <Link className="btn btn-light me-2" to={homeLink}>
                        {user?.role === 'ADMIN' ? 'Admin Panel' : user?.role === 'DOCTOR' ? 'Doctor Dashboard' : 'Home'}
                    </Link>

                    {/* Show "My Appointments" only for Patients */}
                    {user?.role === 'PATIENT' && (
                        <Link className="btn btn-light me-2" to="/my-appointments">My Appointments</Link>
                    )}

                    <a className="btn btn-danger ms-2" href="http://localhost:8080/logout">Logout</a>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;