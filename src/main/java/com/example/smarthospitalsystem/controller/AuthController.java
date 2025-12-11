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
    public String registerUser(@ModelAttribute User user) {
        // Encrypt password before saving
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        // Default role
        user.setRole(User.Role.PATIENT);

        userRepository.save(user);
        return "redirect:/login?success";
    }
}