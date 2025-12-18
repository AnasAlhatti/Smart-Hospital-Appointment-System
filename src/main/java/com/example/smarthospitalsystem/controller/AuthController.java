package com.example.smarthospitalsystem.controller;

import com.example.smarthospitalsystem.model.User;
import com.example.smarthospitalsystem.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;

@Controller // Note: @Controller, NOT @RestController, because we are returning HTML views
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Show Login Page
    @GetMapping("/login")
    public String login() {
        return "login"; // Looks for login.html in templates
    }

    // Show Register Page
    @GetMapping("/register")
    public String register(Model model) {
        model.addAttribute("user", new User());
        return "register"; // Looks for register.html in templates
    }

    // Handle Register Logic
    @PostMapping("/register")
    public String registerUser(@ModelAttribute com.example.smarthospitalsystem.model.User user, org.springframework.ui.Model model) {
        // 1. Check if Username Exists
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            model.addAttribute("error", "Username is already taken!");
            return "register"; // Send them back to register page
        }

        // 2. Validate Password Strength (Regex)
        // (At least 8 chars, 1 Upper, 1 Number, 1 Special)
        String passRegex = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!]).{8,}$";
        if (!user.getPassword().matches(passRegex)) {
            model.addAttribute("error", "Password is too weak. Needs 8+ chars, 1 Upper, 1 Number, 1 Special Char.");
            return "register";
        }

        // 3. Save
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole(com.example.smarthospitalsystem.model.User.Role.PATIENT);
        userRepository.save(user);

        return "redirect:/login";
    }
}