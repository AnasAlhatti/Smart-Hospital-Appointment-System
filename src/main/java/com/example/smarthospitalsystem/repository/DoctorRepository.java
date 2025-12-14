package com.example.smarthospitalsystem.repository;

import com.example.smarthospitalsystem.model.Doctor;
import org.jspecify.annotations.NullMarked;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
@NullMarked
public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    // Find doctors by their department ID
    List<Doctor> findByDepartmentId(Long departmentId);

    Optional<Doctor> findByUserId(Long userId);
}