import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';

const Booking = () => {
    const { doctorId } = useParams();
    const navigate = useNavigate();
    const [dateTime, setDateTime] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        api.post('/appointments/book', { doctorId: doctorId, dateTime: dateTime })
            .then(() => {
                alert('Appointment Booked Successfully!');
                navigate('/my-appointments');
            })
            .catch(err => alert('Failed to book. ' + err));
    };

    return (
        <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
            <div className="card border-0 shadow-lg" style={{ maxWidth: '450px', width: '100%' }}>
                <div className="card-header bg-primary text-white text-center py-4 border-0">
                    <i className="bi bi-calendar-check-fill display-1 mb-2"></i>
                    <h4 className="fw-bold m-0">Book Appointment</h4>
                </div>
                <div className="card-body p-4">
                    <p className="text-center text-muted mb-4">
                        Please select your preferred time slot below.
                    </p>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="form-label fw-bold text-uppercase small text-muted">Date & Time</label>
                            <input
                                type="datetime-local"
                                className="form-control form-control-lg bg-light border-0"
                                required
                                onChange={(e) => setDateTime(e.target.value)}
                            />
                        </div>
                        <div className="d-grid gap-2">
                            <button type="submit" className="btn btn-primary btn-lg fw-bold shadow-sm">
                                Confirm Booking
                            </button>
                            <button type="button" className="btn btn-light text-muted" onClick={() => navigate(-1)}>
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Booking;