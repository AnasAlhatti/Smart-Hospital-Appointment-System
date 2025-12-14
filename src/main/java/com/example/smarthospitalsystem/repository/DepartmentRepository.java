package com.example.smarthospitalsystem.repository;

import com.example.smarthospitalsystem.model.Department;
import org.jspecify.annotations.NullMarked;
import org.springframework.data.jpa.repository.JpaRepository;

@NullMarked
public interface DepartmentRepository extends JpaRepository<Department, Long> {
}