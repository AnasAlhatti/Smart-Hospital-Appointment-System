package com.example.smarthospitalsystem.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "appointments")
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // The Patient (A User with role PATIENT)
    @ManyToOne
    @JoinColumn(name = "patient_id", nullable = false)
    private User patient;

    // The Doctor
    @ManyToOne
    @JoinColumn(name = "doctor_id", nullable = false)
    private Doctor doctor;

    @Column(nullable = false)
    private LocalDateTime appointmentTime;

    @Enumerated(EnumType.STRING)
    private Status status; // PENDING, APPROVED, REJECTED, COMPLETED

    public enum Status {
        PENDING, APPROVED, REJECTED, COMPLETED
    }
}