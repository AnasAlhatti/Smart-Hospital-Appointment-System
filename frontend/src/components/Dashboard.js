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
        // 1. Check User Role immediately
        api.get('/auth/me')
            .then(res => {
                const user = res.data;
                if (user.role === 'DOCTOR') {
                    navigate('/doctor-dashboard'); // Kick Doctor out
                } else if (user.role === 'ADMIN') {
                    navigate('/admin-dashboard');  // Kick Admin out
                } else {
                    // Only if Patient, load the data
                    fetchData();
                    setLoading(false);
                }
            })
            .catch(() => setLoading(false));
    }, [navigate]);

    const fetchData = () => {
        api.get('/departments')
            .then(res => {
                if (Array.isArray(res.data)) setDepartments(res.data);
            })
            .catch(err => console.error(err));
    };

    const handleDeptClick = (deptId) => {
        setSelectedDept(deptId);
        api.get(`/doctors/${deptId}`)
            .then(res => {
                if (Array.isArray(res.data)) setDoctors(res.data);
            })
            .catch(err => console.error(err));
    };

    if (loading) return <div className="text-center mt-5">Loading...</div>;

    return (
        <div className="container">
            <h2 className="mb-4">Find a Doctor</h2>

            <div className="row">
                <div className="col-md-4">
                    <div className="list-group">
                        <button className="list-group-item list-group-item-action active">
                            Select Department
                        </button>
                        {Array.isArray(departments) && departments.map(dept => (
                            <button
                                key={dept.id}
                                className={`list-group-item list-group-item-action ${selectedDept === dept.id ? 'bg-light' : ''}`}
                                onClick={() => handleDeptClick(dept.id)}
                            >
                                {dept.name}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="col-md-8">
                    {selectedDept && <h4>Available Doctors</h4>}

                    <div className="row">
                        {Array.isArray(doctors) && doctors.map(doc => (
                            <div className="col-md-6 mb-3" key={doc.id}>
                                <div className="card shadow-sm">
                                    <div className="card-body">
                                        <h5 className="card-title">{doc.user?.fullName}</h5>
                                        <p className="card-text text-muted">{doc.specialization}</p>
                                        <button
                                            className="btn btn-primary w-100"
                                            onClick={() => navigate(`/book/${doc.id}`)}
                                        >
                                            Book Appointment
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;