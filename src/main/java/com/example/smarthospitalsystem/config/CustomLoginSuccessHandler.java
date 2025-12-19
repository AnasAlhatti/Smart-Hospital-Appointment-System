package com.example.smarthospitalsystem.config;

import com.example.smarthospitalsystem.model.User;
import com.example.smarthospitalsystem.repository.UserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class CustomLoginSuccessHandler implements AuthenticationSuccessHandler {

    @Autowired
    private UserRepository userRepository;

    // Inject the URL from application.properties (https://localhost:3000 or AWS URL)
    @Value("${app.frontend.url}")
    private String frontendUrl;

    @Override
    public void onAuthenticationSuccess(@NotNull HttpServletRequest request, @NotNull HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        // Determine the redirect path based on role
        String redirectPath = "";
        if (user.getRole() == User.Role.ADMIN) {
            redirectPath = "/admin-dashboard";
        } else if (user.getRole() == User.Role.DOCTOR) {
            redirectPath = "/doctor-dashboard";
        } else {
            redirectPath = "/"; // Patient goes home
        }

        response.sendRedirect(frontendUrl + redirectPath);
    }
}