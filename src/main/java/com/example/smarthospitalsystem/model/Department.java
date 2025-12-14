package com.example.smarthospitalsystem.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "departments")
public class Department {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String description;

    // A department has many doctors (This connects to Doctor class)
    // "mappedBy" refers to the field name in the Doctor class
    // @OneToMany(mappedBy = "department")
    // private List<Doctor> doctors;
    // (Optional: You can uncomment the lines above if you need the list of doctors here)
}
