import React, { useState, useEffect } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [departments, setDepartments] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [selectedDept, setSelectedDept] = useState(null);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Auth check logic remains same...
        api.get('/auth/me').then(res => {
            if (res.data.role === 'DOCTOR') navigate('/doctor-dashboard');
            else if (res.data.role === 'ADMIN') navigate('/admin-dashboard');
            else { fetchData(); setLoading(false); }
        }).catch(() => setLoading(false));
    }, [navigate]);

    const fetchData = () => {
        api.get('/departments').then(res => {
            if (Array.isArray(res.data)) setDepartments(res.data);
        });
    };

    const handleDeptClick = (deptId) => {
        setSelectedDept(deptId);
        api.get(`/doctors/${deptId}`).then(res => {
            if (Array.isArray(res.data)) setDoctors(res.data);
        });
    };

    if (loading) return <div className="text-center mt-5"><div className="spinner-border text-primary"></div></div>;

    return (
        <div>
            {/* HERO SECTION */}
            <div className="bg-light py-5 mb-5 border-bottom">
                <div className="container text-center">
                    <h1 className="display-4 fw-bold text-primary">Your Health, Our Priority</h1>
                    <p className="lead text-muted">Book appointments with top specialists in just a few clicks.</p>
                </div>
            </div>

            <div className="container pb-5">
                <div className="row g-4">
                    {/* LEFT SIDEBAR: DEPARTMENTS */}
                    <div className="col-md-3">
                        <div className="card shadow-sm border-0">
                            <div className="card-header bg-white fw-bold text-uppercase small text-muted py-3">
                                Departments
                            </div>
                            <div className="list-group list-group-flush">
                                {Array.isArray(departments) && departments.map(dept => (
                                    <button
                                        key={dept.id}
                                        className={`list-group-item list-group-item-action py-3 border-0 ${selectedDept === dept.id ? 'bg-primary text-white shadow-sm rounded' : 'text-secondary'}`}
                                        onClick={() => handleDeptClick(dept.id)}
                                        style={{ transition: 'all 0.2s' }}
                                    >
                                        <i className="bi bi-hospital me-2"></i>
                                        {dept.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT CONTENT: DOCTORS */}
                    <div className="col-md-9">
                        {!selectedDept ? (
                            <div className="text-center py-5 text-muted bg-light rounded-3 border border-dashed">
                                <i className="bi bi-arrow-left-circle display-4 d-block mb-3 opacity-50"></i>
                                <h5>Select a department to view doctors</h5>
                            </div>
                        ) : (
                            <>
                                <h4 className="mb-4">Available Specialists</h4>
                                <div className="row g-3">
                                    {doctors.length === 0 ? <p>No doctors found.</p> : doctors.map(doc => (
                                        <div className="col-md-6 col-lg-4" key={doc.id}>
                                            <div className="card h-100 shadow-sm border-0 hover-effect text-center p-3">
                                                <div className="card-body">
                                                    <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex p-3 mb-3 text-primary">
                                                        <i className="bi bi-person-workspace fs-1"></i>
                                                    </div>
                                                    <h5 className="card-title fw-bold">{doc.user?.fullName}</h5>
                                                    <p className="card-text text-muted small text-uppercase">{doc.specialization}</p>
                                                    <button
                                                        className="btn btn-outline-primary w-100 rounded-pill mt-2"
                                                        onClick={() => navigate(`/book/${doc.id}`)}
                                                    >
                                                        Book Now
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