package com.example.smarthospitalsystem.repository;

import com.example.smarthospitalsystem.model.Prescription;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface PrescriptionRepository extends JpaRepository<@NotNull Prescription, @NotNull Long> {

    // Fetch prescriptions linked to appointments of a specific patient
    @Query("SELECT p FROM Prescription p WHERE p.appointment.patient.username = :username")
    List<Prescription> findByPatientUsername(@Param("username") String username);
}