import React, { useEffect, useState } from 'react';
import api from '../api';

const MyAppointments = () => {
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        api.get('/my-appointments')
            .then(res => setAppointments(res.data))
            .catch(err => console.error(err));
    }, []);

    const getStatusBadge = (status) => {
        if (status === 'APPROVED') return 'badge bg-success';
        if (status === 'REJECTED') return 'badge bg-danger';
        return 'badge bg-warning text-dark';
    };

    return (
        <div className="container mt-4">
            <h2>My Appointments</h2>
            <table className="table table-striped mt-3">
                <thead>
                <tr>
                    <th>Doctor</th>
                    <th>Date & Time</th>
                    <th>Status</th>
                </tr>
                </thead>
                <tbody>
                {appointments.map(appt => (
                    <tr key={appt.id}>
                        <td>{appt.doctor.user.fullName} ({appt.doctor.specialization})</td>
                        <td>{new Date(appt.appointmentTime).toLocaleString()}</td>
                        <td>
                                <span className={getStatusBadge(appt.status)}>
                                    {appt.status}
                                </span>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            {appointments.length === 0 && <p className="text-muted">No appointments found.</p>}
        </div>
    );
};

export default MyAppointments;