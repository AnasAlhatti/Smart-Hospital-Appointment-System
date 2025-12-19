import React, { useState, useEffect } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css'; // Ensure icons are loaded

const Dashboard = () => {
    // UI State
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Data State (For Patients)
    const [departments, setDepartments] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [selectedDept, setSelectedDept] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        // 1. Check who is logged in
        api.get('/auth/me')
            .then(res => {
                const userData = res.data;
                setUser(userData);

                // 2. LOGIC FOR REDIRECTS
                if (userData.role === 'DOCTOR') {
                    navigate('/doctor-dashboard');
                    // IMPORTANT: Do NOT set loading(false).
                    // Keep loading true so they see a spinner until the page changes.
                }
                else if (userData.role === 'ADMIN') {
                    navigate('/admin-dashboard');
                    // Keep loading true...
                }
                else {
                    // 3. IF PATIENT -> Load data and show the dashboard
                    fetchDepartments();
                    setLoading(false); // Stop loading ONLY for patients
                }
            })
            .catch(() => {
                // 4. IF NOT LOGGED IN -> Show Guest Landing Page
                setUser(null);
                setLoading(false); // Stop loading so we can render the Hero section
            });
    }, [navigate]);

    // Helper to fetch departments
    const fetchDepartments = () => {
        api.get('/departments')
            .then(res => {
                if (Array.isArray(res.data)) setDepartments(res.data);
            })
            .catch(err => console.error("Failed to load departments", err));
    };

    // Helper to fetch doctors when clicking a department
    const handleDeptClick = (deptId) => {
        setSelectedDept(deptId);
        api.get(`/doctors/${deptId}`)
            .then(res => {
                if (Array.isArray(res.data)) setDoctors(res.data);
            })
            .catch(err => console.error("Failed to load doctors", err));
    };

    // --- LOADING VIEW ---
    // This shows while checking auth OR while redirecting Doctors/Admins
    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    // --- VIEW 1: GUEST LANDING PAGE (Not Logged In) ---
    if (!user) {
        // Calculate correct URL for Login/Register (Handles AWS vs Localhost)
        const SERVER_URL = process.env.REACT_APP_API_URL
            ? process.env.REACT_APP_API_URL.replace('/api', '')
            : 'https://localhost:8080';

        return (
            <div className="container-fluid p-0 fade-in">
                {/* Hero Section */}
                <div className="bg-primary text-white text-center py-5" style={{ background: 'linear-gradient(135deg, #0d6efd 0%, #0099ff 100%)' }}>
                    <div className="container py-5">
                        <i className="bi bi-heart-pulse-fill display-1 mb-3"></i>
                        <h1 className="display-3 fw-bold">Smart Hospital System</h1>
                        <p className="lead fs-4 mb-4 opacity-75">
                            Professional healthcare, digital convenience. <br/>
                            Book appointments and manage your health securely.
                        </p>
                        <div className="d-flex justify-content-center gap-3 mt-4">
                            <a href={`${SERVER_URL}/login`} className="btn btn-light btn-lg fw-bold px-5 rounded-pill shadow-lg text-primary">
                                <i className="bi bi-box-arrow-in-right me-2"></i> Login to Book
                            </a>
                            <a href={`${SERVER_URL}/register`} className="btn btn-outline-light btn-lg fw-bold px-5 rounded-pill">
                                Register New Patient
                            </a>
                        </div>
                    </div>
                </div>

                {/* Info Cards */}
                <div className="container py-5 mt-4">
                    <div className="row g-4 text-center">
                        <div className="col-md-4">
                            <div className="p-4 h-100">
                                <div className="text-primary mb-3"><i className="bi bi-calendar-date fs-1"></i></div>
                                <h3 className="fw-bold">Instant Booking</h3>
                                <p className="text-muted">No waiting on hold. Select your department and doctor instantly.</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="p-4 h-100 border-start border-end">
                                <div className="text-primary mb-3"><i className="bi bi-file-medical fs-1"></i></div>
                                <h3 className="fw-bold">Digital Records</h3>
                                <p className="text-muted">Access your history and prescriptions from anywhere securely.</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="p-4 h-100">
                                <div className="text-primary mb-3"><i className="bi bi-people fs-1"></i></div>
                                <h3 className="fw-bold">Top Specialists</h3>
                                <p className="text-muted">We have the best doctors across multiple departments ready to help.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // --- VIEW 2: PATIENT DASHBOARD (Only for Patients) ---

    // SAFETY CHECK: If logic fails and a Doctor reaches here, show nothing.
    if (user.role !== 'PATIENT') return null;

    return (
        <div>
            {/* Dashboard Header */}
            <div className="bg-light py-5 mb-5 border-bottom">
                <div className="container text-center">
                    <h1 className="display-5 fw-bold text-primary">Welcome back, {user.username}!</h1>
                    <p className="lead text-muted">Select a department below to find a doctor.</p>
                </div>
            </div>

            <div className="container pb-5">
                <div className="row g-4">
                    {/* Sidebar: Departments */}
                    <div className="col-md-3">
                        <div className="card shadow-sm border-0">
                            <div className="card-header bg-white fw-bold text-uppercase small text-muted py-3">
                                <i className="bi bi-grid me-2"></i> Departments
                            </div>
                            <div className="list-group list-group-flush">
                                {departments.map(dept => (
                                    <button
                                        key={dept.id}
                                        className={`list-group-item list-group-item-action py-3 border-0 d-flex justify-content-between align-items-center ${selectedDept === dept.id ? 'bg-primary text-white shadow-sm rounded' : 'text-secondary'}`}
                                        onClick={() => handleDeptClick(dept.id)}
                                        style={{ transition: 'all 0.2s' }}
                                    >
                                        <span><i className="bi bi-hospital me-2"></i>{dept.name}</span>
                                        {selectedDept === dept.id && <i className="bi bi-chevron-right"></i>}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Main Content: Doctors */}
                    <div className="col-md-9">
                        {!selectedDept ? (
                            <div className="text-center py-5 text-muted bg-light rounded-3 border border-dashed h-100 d-flex flex-column justify-content-center align-items-center">
                                <i className="bi bi-arrow-left-circle display-4 d-block mb-3 opacity-25"></i>
                                <h5>Please select a department from the left menu</h5>
                            </div>
                        ) : (
                            <>
                                <h4 className="mb-4 text-primary border-bottom pb-2">Available Specialists</h4>
                                <div className="row g-3">
                                    {doctors.length === 0 ? <p className="text-muted">No doctors found in this department.</p> : doctors.map(doc => (
                                        <div className="col-md-6 col-lg-4" key={doc.id}>
                                            <div className="card h-100 shadow-sm border-0 hover-effect text-center p-3">
                                                <div className="card-body">
                                                    <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex p-3 mb-3 text-primary">
                                                        <i className="bi bi-person-workspace fs-1"></i>
                                                    </div>
                                                    <h5 className="card-title fw-bold mb-1">{doc.user?.fullName || doc.user?.username}</h5>
                                                    <p className="badge bg-light text-secondary mb-3">{doc.specialization}</p>
                                                    <button
                                                        className="btn btn-outline-primary w-100 rounded-pill mt-2 fw-bold"
                                                        onClick={() => navigate(`/book/${doc.id}`)}
                                                    >
                                                        Book Appointment
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;