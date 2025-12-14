import React, { useEffect, useState } from 'react';
import api from '../api';

const DoctorDashboard = () => {
    const [appointments, setAppointments] = useState([]);

    const fetchAppointments = () => {
        api.get('/doctor/appointments')
            .then(res => setAppointments(res.data))
            .catch(err => console.error("Error fetching doctor appointments:", err));
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    const updateStatus = (id, newStatus) => {
        api.post(`/appointments/${id}/status`, newStatus, {
            headers: { 'Content-Type': 'text/plain' } // Send simple string
        })
            .then(() => {
                alert(`Appointment ${newStatus}!`);
                fetchAppointments(); // Refresh the list
            })
            .catch(err => alert("Failed to update status"));
    };

    return (
        <div className="container mt-4">
            <h2 className="text-primary">Doctor Dashboard</h2>
            <p>Manage your patient requests.</p>

            <div className="card shadow-sm">
                <div className="card-body">
                    <table className="table">
                        <thead>
                        <tr>
                            <th>Patient Name</th>
                            <th>Date/Time</th>
                            <th>Current Status</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {appointments.map(appt => (
                            <tr key={appt.id}>
                                <td>{appt.patient.fullName}</td>
                                <td>{new Date(appt.appointmentTime).toLocaleString()}</td>
                                <td className="fw-bold">{appt.status}</td>
                                <td>
                                    {appt.status === 'PENDING' && (
                                        <>
                                            <button
                                                className="btn btn-sm btn-success me-2"
                                                onClick={() => updateStatus(appt.id, 'APPROVED')}
                                            >
                                                Approve
                                            </button>
                                            <button
                                                className="btn btn-sm btn-danger"
                                                onClick={() => updateStatus(appt.id, 'REJECTED')}
                                            >
                                                Reject
                                            </button>
                                        </>
                                    )}
                                    {appt.status !== 'PENDING' && <span className="text-muted">Completed</span>}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    {appointments.length === 0 && <p className="text-center mt-3">No pending appointments.</p>}
                </div>
            </div>
        </div>
    );
};

export default DoctorDashboard;