package com.example.smarthospitalsystem.repository;

import com.example.smarthospitalsystem.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    // Used to find a user during login
    Optional<User> findByUsername(String username);
}