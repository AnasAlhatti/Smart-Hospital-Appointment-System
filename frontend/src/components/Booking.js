import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';

const Booking = () => {
    const { doctorId } = useParams();
    const navigate = useNavigate();
    const [dateTime, setDateTime] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        api.post('/appointments/book', {
            doctorId: doctorId,
            dateTime: dateTime
        })
            .then(() => {
                alert('Appointment Booked Successfully!');
                navigate('/my-appointments');
            })
            .catch(err => alert('Failed to book. ' + err));
    };

    return (
        <div className="container mt-5">
            <div className="card mx-auto" style={{maxWidth: '500px'}}>
                <div className="card-header bg-success text-white">
                    Confirm Appointment
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Select Date & Time</label>
                            <input
                                type="datetime-local"
                                className="form-control"
                                required
                                onChange={(e) => setDateTime(e.target.value)}
                            />
                        </div>
                        <button type="submit" className="btn btn-success w-100">Confirm Booking</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Booking;