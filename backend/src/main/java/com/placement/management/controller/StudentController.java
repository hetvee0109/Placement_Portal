package com.placement.management.controller;

import com.placement.management.dto.StudentDashboardDTO;
import com.placement.management.dto.TPODashboardDTO;
import com.placement.management.entity.CareerPreference;
import com.placement.management.entity.StudentProfile;
import com.placement.management.entity.User;
import com.placement.management.repository.NotificationRepository;
import com.placement.management.repository.PlacementSummaryRepository;
import com.placement.management.repository.UserRepository;
import com.placement.management.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = "http://localhost:3000")
public class StudentController {

    private final StudentService service;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private PlacementSummaryRepository placementRecordRepository;

    public StudentController(StudentService service) {
        this.service = service;
    }

    // ======================
    // DASHBOARD APIs
    // ======================

    @GetMapping("/dashboard/student/{userId}")
    public ResponseEntity<StudentDashboardDTO> getStudentDashboard(@PathVariable Long userId) {
        return ResponseEntity.ok(service.getStudentDashboard(userId));
    }

    @GetMapping("/dashboard/tpo")
    public ResponseEntity<TPODashboardDTO> getTpoDashboard() {
        TPODashboardDTO dto = new TPODashboardDTO();

        // 1. Basic Counts
        long totalStudents = userRepository.count();
        long placedCount = placementRecordRepository.count();

        // Correct Unique Company Count logic
        long uniqueCompanies = notificationRepository.findAll().stream()
                .map(n -> n.getCompanyName())
                .distinct()
                .count();

        dto.setTotalStudents(totalStudents);
        dto.setPlacedCount(placedCount);
        dto.setUnplacedCount(totalStudents - placedCount);
        dto.setTotalCompanies(uniqueCompanies);

        // 2. Success Distribution Data (Pie Chart)
        // Using explicit HashMaps to avoid "incompatible types" error
        List<Map<String, Object>> chartData = new ArrayList<>();

        Map<String, Object> placedData = new HashMap<>();
        placedData.put("name", "Placed");
        placedData.put("value", placedCount);

        Map<String, Object> unplacedData = new HashMap<>();
        unplacedData.put("name", "Unplaced");
        unplacedData.put("value", totalStudents - placedCount);

        chartData.add(placedData);
        chartData.add(unplacedData);
        dto.setChartData(chartData);

        // 3. Monthly Hiring Trend (Area Chart)
        List<Map<String, Object>> monthlyTrend = placementRecordRepository.findAll().stream()
                .filter(p -> p.getSelectionDate() != null)
                .collect(Collectors.groupingBy(
                        p -> p.getSelectionDate().getMonth().toString().substring(0, 3),
                        Collectors.counting()
                ))
                .entrySet().stream()
                .map(e -> {
                    Map<String, Object> m = new HashMap<>();
                    m.put("month", e.getKey());
                    m.put("count", e.getValue());
                    return m;
                }).collect(Collectors.toList());
        dto.setMonthlyData(monthlyTrend);

        // 4. Top Hiring Partners (Bar Chart)
        List<Map<String, Object>> topRecruiters = placementRecordRepository.findAll().stream()
                .collect(Collectors.groupingBy(
                        p -> p.getNotification().getCompanyName(),
                        Collectors.counting()
                ))
                .entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .limit(5)
                .map(e -> {
                    Map<String, Object> m = new HashMap<>();
                    m.put("name", e.getKey());
                    m.put("count", e.getValue());
                    return m;
                }).collect(Collectors.toList());
        dto.setCompanyData(topRecruiters);

        return ResponseEntity.ok(dto);
    }

    // ======================
    // STUDENT MANAGEMENT APIs
    // ======================

    @GetMapping
    public List<User> getStudents(@RequestParam String role) {
        return service.getAllStudents(role);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteStudent(@PathVariable Long id) {
        return userRepository.findById(id).map(student -> {
            userRepository.delete(student);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Student deleted successfully");
            return ResponseEntity.ok().body(response);
        }).orElse(ResponseEntity.notFound().build());
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