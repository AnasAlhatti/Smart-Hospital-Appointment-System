import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

// Components
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard'; // Handles Guest vs Patient vs Redirects
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
                {/* ROOT ROUTE ('/'):
                  - If Guest -> Shows Landing Page
                  - If Patient -> Shows Department/Doctor List
                  - If Doctor/Admin -> Redirects to their dashboards
                */}
                <Route path="/" element={<Dashboard />} />

                {/* PATIENT PROTECTED ROUTES */}
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

                {/* DOCTOR PROTECTED ROUTE */}
                <Route
                    path="/doctor-dashboard"
                    element={
                        <ProtectedRoute roleRequired="DOCTOR">
                            <DoctorDashboard />
                        </ProtectedRoute>
                    }
                />

                {/* ADMIN PROTECTED ROUTE */}
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