import React, { useEffect, useState } from 'react';
import api from '../api';

const MyAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch both Appointments and Prescriptions in parallel
                const [apptRes, prescRes] = await Promise.all([
                    api.get('/my-appointments'),
                    api.get('/my-prescriptions')
                ]);
                setAppointments(apptRes.data);
                setPrescriptions(prescRes.data);
            } catch (err) {
                console.error("Error loading data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Helper: Find if an appointment has a prescription/diagnosis
    const getPrescriptionForAppt = (apptId) => {
        return prescriptions.find(p => p.appointment.id === apptId);
    };

    if (loading) return <div className="text-center mt-5"><div className="spinner-border text-primary"></div></div>;

    return (
        <div className="container mt-5">
            <h2 className="mb-4 text-primary fw-bold">My Medical History</h2>

            {appointments.length === 0 ? (
                <div className="alert alert-info shadow-sm">You have no appointment history.</div>
            ) : (
                <div className="row">
                    {appointments.map(appt => {
                        const prescription = getPrescriptionForAppt(appt.id);
                        const isCompleted = appt.status === 'COMPLETED' || appt.status === 'APPROVED';

                        return (
                            <div className="col-lg-6 mb-4" key={appt.id}>
                                <div className={`card h-100 shadow-sm border-0 ${isCompleted ? 'border-start border-5 border-success' : 'border-start border-5 border-warning'}`}>
                                    <div className="card-body">
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <h5 className="card-title fw-bold text-dark mb-0">
                                                Dr. {appt.doctor.user.fullName}
                                            </h5>
                                            <span className={`badge rounded-pill ${
                                                appt.status === 'APPROVED' ? 'bg-success' :
                                                    appt.status === 'COMPLETED' ? 'bg-primary' :
                                                        appt.status === 'REJECTED' ? 'bg-danger' : 'bg-warning text-dark'
                                            }`}>
                                                {appt.status}
                                            </span>
                                        </div>

                                        <p className="card-text text-muted mb-1">
                                            <strong>Department:</strong> {appt.doctor.department.name}
                                        </p>
                                        <p className="card-text text-muted mb-3">
                                            <strong>Date:</strong> {new Date(appt.appointmentTime).toLocaleString()}
                                        </p>

                                        {/* DIAGNOSIS SECTION (Only appears if exists) */}
                                        {prescription && (
                                            <div className="mt-3 p-3 bg-light rounded border">
                                                <h6 className="text-primary fw-bold mb-2">Medical Report</h6>
                                                <div className="mb-2">
                                                    <span className="fw-bold text-dark">Diagnosis:</span>
                                                    <p className="mb-0 text-secondary">{prescription.diagnosis}</p>
                                                </div>
                                                <div className="mb-2">
                                                    <span className="fw-bold text-dark">Prescribed Medicine:</span>
                                                    <p className="mb-0 text-success fw-bold">{prescription.medicineName}</p>
                                                </div>
                                                <div className="mb-0">
                                                    <span className="fw-bold text-dark">Dosage:</span>
                                                    <span className="text-muted ms-2">{prescription.dosage}</span>
                                                </div>
                                                {/* Show FDA Info if available */}
                                                {prescription.notes && (
                                                    <div className="mt-2 text-muted fst-italic" style={{fontSize: '0.85rem'}}>
                                                        <small>{prescription.notes}</small>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default MyAppointments;