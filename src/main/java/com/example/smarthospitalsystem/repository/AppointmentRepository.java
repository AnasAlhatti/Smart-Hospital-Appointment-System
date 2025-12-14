package com.example.smarthospitalsystem.repository;

import com.example.smarthospitalsystem.model.Appointment;
import org.jspecify.annotations.NullMarked;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

@NullMarked
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    // Fetch all appointments for a specific patient
    List<Appointment> findByPatientId(Long patientId);

    // Fetch all appointments for a specific doctor
    List<Appointment> findByDoctorId(Long doctorId);
}