package com.example.smarthospitalsystem.controller;

import com.example.smarthospitalsystem.model.*;
import com.example.smarthospitalsystem.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class AdminController {

    @Autowired private UserRepository userRepository;
    @Autowired private DoctorRepository doctorRepository;
    @Autowired private DepartmentRepository departmentRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    // --- USER MANAGEMENT ---

    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @PostMapping("/patients")
    public User createPatient(@RequestBody User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole(User.Role.PATIENT);
        return userRepository.save(user);
    }

    @PutMapping("/users/{id}")
    public User updateUser(@PathVariable Long id, @RequestBody User details) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        user.setFullName(details.getFullName());
        user.setUsername(details.getUsername());
        // Only update password if a new one is sent
        if (details.getPassword() != null && !details.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(details.getPassword()));
        }
        return userRepository.save(user);
    }

    @DeleteMapping("/users/{id}")
    public void deleteUser(@PathVariable Long id) {
        userRepository.deleteById(id);
    }

    // --- DOCTOR MANAGEMENT ---

    @GetMapping("/doctors")
    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }


    @PostMapping("/doctors")
    public Doctor createDoctor(@RequestBody DoctorRequest request) {
        User user = new User();
        user.setFullName(request.getFullName());
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(User.Role.DOCTOR);
        User savedUser = userRepository.save(user);

        Department dept = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() -> new RuntimeException("Department not found"));

        Doctor doctor = new Doctor();
        doctor.setUser(savedUser);
        doctor.setDepartment(dept);
        doctor.setSpecialization(request.getSpecialization());

        return doctorRepository.save(doctor);
    }

    @PutMapping("/doctors/{id}")
    public Doctor updateDoctor(@PathVariable Long id, @RequestBody DoctorRequest request) {
        Doctor doctor = doctorRepository.findById(id).orElseThrow(() -> new RuntimeException("Doctor not found"));

        // Update Department
        if(request.getDepartmentId() != null) {
            Department dept = departmentRepository.findById(request.getDepartmentId())
                    .orElseThrow(() -> new RuntimeException("Department not found"));
            doctor.setDepartment(dept);
        }

        // Update Specialization
        if(request.getSpecialization() != null) doctor.setSpecialization(request.getSpecialization());

        // Update Basic User Info (Name)
        if(request.getFullName() != null) {
            User user = doctor.getUser();
            user.setFullName(request.getFullName());
            userRepository.save(user);
        }

        return doctorRepository.save(doctor);
    }

    // --- DEPARTMENT MANAGEMENT ---

    @PostMapping("/departments")
    public Department createDepartment(@RequestBody Department department) {
        return departmentRepository.save(department);
    }

    @PutMapping("/departments/{id}")
    public Department updateDepartment(@PathVariable Long id, @RequestBody Department details) {
        Department dept = departmentRepository.findById(id).orElseThrow();
        dept.setName(details.getName());
        dept.setDescription(details.getDescription());
        return departmentRepository.save(dept);
    }
}