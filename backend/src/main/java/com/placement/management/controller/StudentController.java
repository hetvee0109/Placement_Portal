//
//package com.placement.management.controller;
//
//import com.placement.management.entity.CareerPreference;
//import com.placement.management.entity.StudentProfile;
//import com.placement.management.entity.User;
//import com.placement.management.service.StudentService;
//import org.springframework.http.MediaType;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//import org.springframework.web.multipart.MultipartFile;
//
//import java.util.List;
//
//@RestController
//@RequestMapping("/api/students")
//@CrossOrigin(origins = "http://localhost:3000")
//public class StudentController {
//
//    private final StudentService service;
//
//    public StudentController(StudentService service) {
//        this.service = service;
//    }
//
//    // ======================
//    // TPO APIs (EXISTING)
//    // ======================
//    @GetMapping
//    public List<User> getStudents(@RequestParam String role) {
//        return service.getAllStudents(role);
//    }
//
//    @DeleteMapping("/{id}")
//    public String deleteStudent(@PathVariable Long id,
//                                @RequestParam String role) {
//        return service.deleteStudent(id, role);
//    }
//
//    // ======================
//    // STUDENT PROFILE APIs
//    // ======================
//
//    @PostMapping(value = "/profile", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
//    public StudentProfile updateProfile(
//            @RequestParam Long userId,
//            @RequestParam List<String> skills,
//            @RequestParam Double tenthPercentage,
//            @RequestParam Double twelfthPercentage,
//            @RequestParam CareerPreference careerPreference,
//            @RequestParam(required = false) MultipartFile resume) {
//
//        return service.saveOrUpdateProfile(
//                userId,
//                skills,
//                tenthPercentage,
//                twelfthPercentage,
//                careerPreference,
//                resume
//        );
//    }
//
//    @GetMapping("/profile/{userId}")
//    public StudentProfile getProfile(@PathVariable Long userId) {
//        return service.getProfile(userId);
//    }
//}


package com.placement.management.controller;

import com.placement.management.dto.StudentDashboardDTO;
import com.placement.management.dto.TPODashboardDTO;
import com.placement.management.entity.CareerPreference;
import com.placement.management.entity.StudentProfile;
import com.placement.management.entity.User;
import com.placement.management.service.StudentService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = "http://localhost:3000")
public class StudentController {

    private final StudentService service;

    public StudentController(StudentService service) {
        this.service = service;
    }

    // ======================
    // DASHBOARD APIs (NEW)
    // ======================

    /**
     * Fetch dynamic data for the Student Dashboard
     */
    @GetMapping("/dashboard/student/{userId}")
    public ResponseEntity<StudentDashboardDTO> getStudentDashboard(@PathVariable Long userId) {
        return ResponseEntity.ok(service.getStudentDashboard(userId));
    }

    /**
     * Fetch dynamic data for the TPO Dashboard
     */
    @GetMapping("/dashboard/tpo")
    public ResponseEntity<TPODashboardDTO> getTPODashboard() {
        return ResponseEntity.ok(service.getTPODashboard());
    }

    // ======================
    // TPO APIs (EXISTING)
    // ======================
    @GetMapping
    public List<User> getStudents(@RequestParam String role) {
        return service.getAllStudents(role);
    }

    @DeleteMapping("/{id}")
    public String deleteStudent(@PathVariable Long id,
                                @RequestParam String role) {
        return service.deleteStudent(id, role);
    }

    // ======================
    // STUDENT PROFILE APIs
    // ======================

    @PostMapping(value = "/profile", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public StudentProfile updateProfile(
            @RequestParam Long userId,
            @RequestParam List<String> skills,
            @RequestParam Double tenthPercentage,
            @RequestParam Double twelfthPercentage,
            @RequestParam CareerPreference careerPreference,
            @RequestParam(required = false) MultipartFile resume) {

        return service.saveOrUpdateProfile(
                userId,
                skills,
                tenthPercentage,
                twelfthPercentage,
                careerPreference,
                resume
        );
    }

    @GetMapping("/profile/{userId}")
    public StudentProfile getProfile(@PathVariable Long userId) {
        return service.getProfile(userId);
    }
}