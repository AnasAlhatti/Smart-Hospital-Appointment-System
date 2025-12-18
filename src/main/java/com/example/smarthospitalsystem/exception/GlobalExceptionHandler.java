package com.example.smarthospitalsystem.exception;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import org.jetbrains.annotations.NotNull;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.TransactionSystemException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // 1. Handle @Valid failures (Controller validation)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<@NotNull Map<String, String>> handleValidationErrors(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error ->
                errors.put("error", error.getDefaultMessage())); // We map to "error" so frontend sees it easily
        return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
    }

    // 2. Handle Database Entity Validation failures (e.g., Regex in User.java)
    @ExceptionHandler(TransactionSystemException.class)
    public ResponseEntity<@NotNull Map<String, String>> handleTransactionException(TransactionSystemException ex) {
        Throwable cause = ex.getRootCause();
        if (cause instanceof ConstraintViolationException) {
            return handleConstraintViolation((ConstraintViolationException) cause);
        }
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Database Transaction Error: " + ex.getMessage()));
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<@NotNull Map<String, String>> handleConstraintViolation(ConstraintViolationException ex) {
        Set<ConstraintViolation<?>> violations = ex.getConstraintViolations();
        String errorMessage = "Invalid Data";
        if (!violations.isEmpty()) {
            errorMessage = violations.iterator().next().getMessage();
        }
        return new ResponseEntity<>(Map.of("error", errorMessage), HttpStatus.BAD_REQUEST);
    }
}