package com.example.smarthospitalsystem.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Data
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    @Size(min = 4, message = "Username must be at least 4 characters")
    @Pattern(regexp = "^[a-zA-Z0-9]+$", message = "Username must be alphanumeric with no spaces")
    private String username;

    @Column(nullable = false)
    @JsonIgnore // Hide hash from JSON
    private String password;

    @Column(nullable = false)
    @Pattern(regexp = "^[a-zA-Z\\s.\\-]+$", message = "Name contains invalid characters")
    private String fullName;

    @Enumerated(EnumType.STRING)
    private Role role;

    public enum Role {
        PATIENT, DOCTOR, ADMIN
    }
}