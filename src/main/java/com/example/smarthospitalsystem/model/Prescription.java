package com.example.smarthospitalsystem.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "prescriptions")
public class Prescription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // One Appointment has One Prescription
    @OneToOne
    @JoinColumn(name = "appointment_id", nullable = false)
    private Appointment appointment;

    private String diagnosis;

    // This data will eventually come from your External API (e.g., "Amoxicillin")
    private String medicineName;

    private String dosage; // e.g., "500mg twice daily"

    private String notes;
}