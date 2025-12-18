import React, { useEffect, useState } from 'react';
import api from '../api';

const DoctorDashboard = () => {
    const [appointments, setAppointments] = useState([]);

    // Prescription Form State
    const [selectedAppt, setSelectedAppt] = useState(null);
    const [prescForm, setPrescForm] = useState({ diagnosis: '', medicineName: '', dosage: '' });

    // SUGGESTIONS STATE
    const [suggestions, setSuggestions] = useState([]);

    const fetchAppointments = () => {
        api.get('/doctor/appointments')
            .then(res => setAppointments(res.data))
            .catch(err => console.error(err));
    };

    useEffect(() => { fetchAppointments(); }, []);

    const updateStatus = (id, newStatus) => {
        api.post(`/appointments/${id}/status`, newStatus, {
            headers: { 'Content-Type': 'text/plain' }
        }).then(fetchAppointments);
    };

    const handlePrescribeClick = (appt) => {
        setSelectedAppt(appt);
        setPrescForm({ diagnosis: '', medicineName: '', dosage: '' });
        setSuggestions([]); // Clear previous suggestions
    };

    // --- NEW: Handle Typing & Fetch Suggestions ---
    const handleMedicineChange = (e) => {
        const value = e.target.value;
        setPrescForm({ ...prescForm, medicineName: value });

        // Only search if user types more than 2 characters
        if (value.length > 2) {
            api.get(`/drugs/search?query=${value}`)
                .then(res => setSuggestions(res.data))
                .catch(() => setSuggestions([]));
        } else {
            setSuggestions([]);
        }
    };

    // --- NEW: Handle Clicking a Suggestion ---
    const selectSuggestion = (name) => {
        setPrescForm({ ...prescForm, medicineName: name });
        setSuggestions([]); // Hide list after selection
    };
    // ---------------------------------------------

    const submitPrescription = (e) => {
        e.preventDefault();
        api.post('/prescriptions', {
            appointmentId: selectedAppt.id,
            ...prescForm
        })
            .then(res => {
                alert(`Prescription Saved!\nFDA Info: ${res.data.notes}`);
                setSelectedAppt(null);
                fetchAppointments();
            })
            .catch(err => alert("Failed to save prescription"));
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="text-primary fw-bold"><i className="bi bi-speedometer2 me-2"></i>Doctor Dashboard</h2>
                <button className="btn btn-outline-secondary btn-sm" onClick={fetchAppointments}><i className="bi bi-arrow-clockwise"></i> Refresh</button>
            </div>

            <div className="card shadow-sm border-0">
                <div className="card-body p-0">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="bg-light">
                        <tr>
                            <th className="ps-4">Patient</th>
                            <th>Schedule</th>
                            <th>Status</th>
                            <th className="text-end pe-4">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {appointments.map(appt => (
                            <tr key={appt.id}>
                                <td className="ps-4">
                                    <div className="d-flex align-items-center">
                                        <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3 text-primary">
                                            <i className="bi bi-person-fill fs-5"></i>
                                        </div>
                                        <div>
                                            <div className="fw-bold">{appt.patient.fullName}</div>
                                            <div className="small text-muted">ID: #{appt.patient.id}</div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <i className="bi bi-clock me-2 text-muted"></i>
                                    {new Date(appt.appointmentTime).toLocaleString()}
                                </td>
                                <td>
                                        <span className={`badge rounded-pill ${appt.status === 'APPROVED' ? 'bg-success' : appt.status === 'PENDING' ? 'bg-warning text-dark' : 'bg-secondary'}`}>
                                            {appt.status}
                                        </span>
                                </td>
                                <td className="text-end pe-4">
                                    {appt.status === 'PENDING' && (
                                        <>
                                            <button className="btn btn-sm btn-success me-2 rounded-pill px-3" onClick={() => updateStatus(appt.id, 'APPROVED')}>
                                                <i className="bi bi-check-lg me-1"></i> Accept
                                            </button>
                                            <button className="btn btn-sm btn-outline-danger rounded-pill px-3" onClick={() => updateStatus(appt.id, 'REJECTED')}>
                                                <i className="bi bi-x-lg me-1"></i> Reject
                                            </button>
                                        </>
                                    )}
                                    {appt.status === 'APPROVED' && (
                                        <button className="btn btn-sm btn-primary rounded-pill px-3" onClick={() => handlePrescribeClick(appt)}>
                                            <i className="bi bi-file-medical me-1"></i> Prescribe
                                        </button>
                                    )}
                                    {appt.status === 'COMPLETED' && <span className="text-muted small"><i className="bi bi-check-all me-1"></i> Done</span>}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Logic remains the same, just styled nicely inside */}
            {selectedAppt && (
                <div className="modal d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content shadow-lg border-0">
                            <div className="modal-header bg-primary text-white">
                                <h5 className="modal-title"><i className="bi bi-prescription2 me-2"></i>Write Prescription</h5>
                                <button className="btn-close btn-close-white" onClick={() => setSelectedAppt(null)}></button>
                            </div>
                            <div className="modal-body p-4">
                                <form onSubmit={submitPrescription}>
                                    <div className="mb-3">
                                        <label className="form-label fw-bold">Diagnosis</label>
                                        <input className="form-control" value={prescForm.diagnosis} onChange={e => setPrescForm({...prescForm, diagnosis: e.target.value})} required />
                                    </div>
                                    <div className="mb-3 position-relative">
                                        <label className="form-label fw-bold">Medicine (FDA Search)</label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-light"><i className="bi bi-search"></i></span>
                                            <input className="form-control" placeholder="Type first 3 letters..." value={prescForm.medicineName} onChange={handleMedicineChange} required />
                                        </div>
                                        {suggestions.length > 0 && (
                                            <ul className="list-group position-absolute w-100 shadow mt-1" style={{zIndex: 2000}}>
                                                {suggestions.map((name, i) => (
                                                    <li key={i} className="list-group-item list-group-item-action" onClick={() => selectSuggestion(name)} style={{cursor:'pointer'}}>{name}</li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                    <div className="mb-4">
                                        <label className="form-label fw-bold">Dosage</label>
                                        <input className="form-control" placeholder="e.g. 500mg" value={prescForm.dosage} onChange={e => setPrescForm({...prescForm, dosage: e.target.value})} required />
                                    </div>
                                    <button className="btn btn-primary w-100 py-2 fw-bold">Save Prescription</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DoctorDashboard;