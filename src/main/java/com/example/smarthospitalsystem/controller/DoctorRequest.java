package com.example.smarthospitalsystem.controller;

import lombok.Data;

@Data
public class DoctorRequest {
    private String fullName;
    private String username;
    private String password;
    private String specialization;
    private Long departmentId;
}