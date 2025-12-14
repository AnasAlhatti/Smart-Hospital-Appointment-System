import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import Booking from './components/Booking';
import MyAppointments from './components/MyAppointments';
import DoctorDashboard from './components/DoctorDashboard';
import AdminDashboard from './components/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
    return (
        <Router>
            <Navbar />
            <Routes>
                {/* Public/Smart Dashboard (Redirects handled inside Dashboard.js) */}
                <Route path="/" element={<Dashboard />} />

                {/* PATIENT ONLY ROUTES */}
                <Route
                    path="/book/:doctorId"
                    element={
                        <ProtectedRoute roleRequired="PATIENT">
                            <Booking />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/my-appointments"
                    element={
                        <ProtectedRoute roleRequired="PATIENT">
                            <MyAppointments />
                        </ProtectedRoute>
                    }
                />

                {/* DOCTOR ONLY ROUTE */}
                <Route
                    path="/doctor-dashboard"
                    element={
                        <ProtectedRoute roleRequired="DOCTOR">
                            <DoctorDashboard />
                        </ProtectedRoute>
                    }
                />

                {/* ADMIN ONLY ROUTE */}
                <Route
                    path="/admin-dashboard"
                    element={
                        <ProtectedRoute roleRequired="ADMIN">
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </Router>
    );
}

export default App;