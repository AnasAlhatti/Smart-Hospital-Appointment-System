package com.example.smarthospitalsystem.service;

import com.example.smarthospitalsystem.model.*;
import com.example.smarthospitalsystem.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private UserRepository userRepository;

    // Logic to book an appointment
    public Appointment bookAppointment(String patientUsername, Long doctorId, LocalDateTime time) {
        User patient = userRepository.findByUsername(patientUsername)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        Appointment appointment = new Appointment();
        appointment.setPatient(patient);
        appointment.setDoctor(doctor);
        appointment.setAppointmentTime(time);
        appointment.setStatus(Appointment.Status.PENDING); // Default status

        return appointmentRepository.save(appointment);
    }

    // Get appointments for the logged-in patient
    public List<Appointment> getPatientAppointments(String username) {
        User patient = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return appointmentRepository.findByPatientId(patient.getId());
    }

    // Get appointments for a doctor (so they can approve/reject)
    public List<Appointment> getDoctorAppointments(String username) {
        User doctorUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Find the doctor profile linked to this user
        Doctor doctor = doctorRepository.findByUserId(doctorUser.getId()) // We need to ensure this method exists in DoctorRepo
                .orElseThrow(() -> new RuntimeException("Doctor profile not found"));

        return appointmentRepository.findByDoctorId(doctor.getId());
    }

    // Helper to find appointment by ID
    public Appointment getAppointmentById(Long id) {
        return appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
    }

    // Helper to save status updates
    public Appointment save(Appointment appointment) {
        return appointmentRepository.save(appointment);
    }
}