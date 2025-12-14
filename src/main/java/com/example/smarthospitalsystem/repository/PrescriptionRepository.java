package com.example.smarthospitalsystem.repository;

import com.example.smarthospitalsystem.model.Prescription;
import org.jspecify.annotations.NullMarked;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

@NullMarked
public interface PrescriptionRepository extends JpaRepository<Prescription, Long> {
    List<Prescription> findByAppointmentId(Long appointmentId);
}