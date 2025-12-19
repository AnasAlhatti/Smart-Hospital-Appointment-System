package com.example.smarthospitalsystem.controller;

import com.example.smarthospitalsystem.model.*;
import com.example.smarthospitalsystem.repository.*;
import com.example.smarthospitalsystem.service.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.example.smarthospitalsystem.repository.UserRepository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("/api")
public class APIController {

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private AppointmentService appointmentService;

    @Autowired
    private UserRepository userRepository;

    @Autowired private com.example.smarthospitalsystem.service.DrugApiService drugApiService;

    @Autowired private PrescriptionRepository prescriptionRepository;

    // 1. Get List of Departments
    @GetMapping("/departments")
    public List<Department> getAllDepartments() {
        return departmentRepository.findAll();
    }

    // 2. Get Doctors by Department
    @GetMapping("/doctors/{deptId}")
    public List<Doctor> getDoctorsByDept(@PathVariable Long deptId) {
        return doctorRepository.findByDepartmentId(deptId);
    }

    // 3. Book an Appointment
    @PostMapping("/appointments/book")
    public Appointment bookAppointment(@RequestBody AppointmentRequest request, Authentication authentication) {
        // "Authentication" holds the details of the currently logged-in user
        String patientUsername = authentication.getName();
        return appointmentService.bookAppointment(patientUsername, request.getDoctorId(), request.getDateTime());
    }

    // 4. Get My Appointments
    @GetMapping("/my-appointments")
    public List<Appointment> getMyAppointments(Authentication authentication) {
        return appointmentService.getPatientAppointments(authentication.getName());
    }

    // 5. [Doctor Only] Get All Appointments assigned to the logged-in Doctor
    @GetMapping("/doctor/appointments")
    public List<Appointment> getDoctorAppointments(Authentication authentication) {
        // Security Check: If the user is NOT a doctor, throw an error
        boolean isDoctor = authentication.getAuthorities().stream()
                .anyMatch(a -> Objects.equals(a.getAuthority(), "ROLE_DOCTOR"));

        if (!isDoctor) {
            throw new RuntimeException("Access Denied: You are not a doctor.");
        }

        return appointmentService.getDoctorAppointments(authentication.getName());
    }

    // 6. [Doctor Only] Approve or Reject Appointment
    @PostMapping("/appointments/{id}/status")
    public Appointment updateStatus(@PathVariable Long id, @RequestBody String status) {
        // Find the appointment
        Appointment appointment = appointmentService.getAppointmentById(id); // We need to add this helper in Service

        // Clean up the status string (remove quotes if sent as raw text)
        String cleanStatus = status.replace("\"", "").trim();
        appointment.setStatus(Appointment.Status.valueOf(cleanStatus));

        return appointmentService.save(appointment); // We need to add 'save' or just use repo
    }

    // 7. [Doctor Only] Create Prescription with External API Data
    @PostMapping("/prescriptions")
    public Prescription createPrescription(@RequestBody PrescriptionRequest request) {
        // Find Appointment
        Appointment appointment = appointmentService.getAppointmentById(request.getAppointmentId());

        // 1. Fetch official info from External API (OpenFDA)
        String fdaInfo = drugApiService.getDrugInfo(request.getMedicineName());

        // 2. Create Prescription
        Prescription prescription = new Prescription();
        prescription.setAppointment(appointment);
        prescription.setMedicineName(request.getMedicineName());
        prescription.setDosage(request.getDosage());
        prescription.setDiagnosis(request.getDiagnosis());
        // Save the API data into the notes
        prescription.setNotes("FDA INFO: " + fdaInfo);

        // 3. Mark appointment as COMPLETED
        appointment.setStatus(Appointment.Status.COMPLETED);
        appointmentService.save(appointment);

        return prescriptionRepository.save(prescription);
    }

    // 8. [Public/Doctor] Search for drugs (Autocomplete)
    @GetMapping("/drugs/search")
    public List<String> searchDrugs(@RequestParam String query) {
        return drugApiService.searchDrugs(query);
    }

    // 9. [Patient] Get My Prescriptions (Diagnoses)
    @GetMapping("/my-prescriptions")
    public List<Prescription> getMyPrescriptions(Authentication authentication) {
        return prescriptionRepository.findByPatientUsername(authentication.getName());
    }

    @GetMapping("/auth/me")
    public User getCurrentUser(Authentication authentication) {
        // Return the full user object (ensure password is excluded in a real app, but fine for now)
        return userRepository.findByUsername(authentication.getName()).orElse(null);
    }
}

// Helper class to receive JSON data for booking
@lombok.Data
class AppointmentRequest {
    private Long doctorId;
    private LocalDateTime dateTime;
}

@lombok.Data
class PrescriptionRequest {
    private Long appointmentId;
    private String diagnosis;
    private String medicineName;
    private String dosage;
}