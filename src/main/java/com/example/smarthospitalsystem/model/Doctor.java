package com.example.smarthospitalsystem.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "doctors")
public class Doctor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String specialization;

    // Link to the User table for Login credentials
    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Link to Department (Many Doctors belong to One Department)
    @ManyToOne
    @JoinColumn(name = "department_id", nullable = false)
    private Department department;

    // Simple availability flag
    private boolean isAvailable = true;
}
