//package com.placement.management.controller;
//
//import com.fasterxml.jackson.databind.ObjectMapper;
//import com.placement.management.entity.*;
//import com.placement.management.entity.Application;
//import com.placement.management.service.NotificationService;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//import org.springframework.web.multipart.MultipartFile;
//
//import java.io.IOException;
//import java.nio.file.Files;
//import java.nio.file.Path;
//import java.nio.file.Paths;
//import java.util.List;
//import java.util.UUID;
//
//import com.placement.management.dto.CompanyApplicationsDTO;
//import com.placement.management.repository.ApplicationRepository;
//
//import java.util.Map;
//import java.util.stream.Collectors;
//
//
//@RestController
//@RequestMapping("/api/notifications")
//@CrossOrigin(origins = "http://localhost:3000")
//public class NotificationController {
//
//    private final NotificationService service;
//    private final String UPLOAD_DIR = "uploads/";
//    private final ApplicationRepository applicationRepo;
//
//
//    public NotificationController(NotificationService service,
//                                  ApplicationRepository applicationRepo) {
//        this.service = service;
//        this.applicationRepo = applicationRepo;
//    }
//
//
//    // TPO: Advanced Create (Supports JSON + PDF File)
//    @PostMapping("/create-advanced")
//    public ResponseEntity<Notification> createAdvanced(
//            @RequestParam("notification") String notificationJson,
//            @RequestParam(value = "file", required = false) MultipartFile file) throws IOException {
//
//        ObjectMapper mapper = new ObjectMapper();
//        mapper.findAndRegisterModules(); // Support for LocalDateTime
//        Notification note = mapper.readValue(notificationJson, Notification.class);
//
//        if (file != null && !file.isEmpty()) {
//            String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
//            Path path = Paths.get(UPLOAD_DIR + fileName);
//            Files.createDirectories(path.getParent());
//            Files.write(path, file.getBytes());
//            note.setAttachmentPath(fileName);
//        }
//
//        return ResponseEntity.ok(service.createNotification(note));
//    }
//
//    // TPO: Filter Students for Private Mode Selection
//    @GetMapping("/filter-students")
//    public ResponseEntity<List<User>> filterStudents(
//            @RequestParam(required = false) String company,
//            @RequestParam(required = false) Double minCpi,
//            @RequestParam(required = false) CareerPreference pref) {
//        return ResponseEntity.ok(service.getFilteredStudents(company, minCpi, pref));
//    }
//
//    // STUDENT: Get notifications with 7-day auto-expiry / Star persistence logic
//    @GetMapping("/student/{studentId}")
//    public ResponseEntity<List<Notification>> getForStudent(@PathVariable Long studentId) {
//        return ResponseEntity.ok(service.getNotificationsForStudent(studentId));
//    }
//
//    // STUDENT: Star/Unstar a notification
//    @PostMapping("/star")
//    public ResponseEntity<?> toggleStar(@RequestParam Long studentId, @RequestParam Long noteId) {
//        service.toggleStar(studentId, noteId);
//        return ResponseEntity.ok("{\"status\": \"SUCCESS\"}");
//    }
//
//    // STUDENT: Apply to Job Drive
//    @PostMapping("/apply")
//    public ResponseEntity<?> apply(@RequestParam Long studentId, @RequestParam Long noteId) {
//        String result = service.applyToJob(studentId, noteId);
//        return ResponseEntity.ok("{\"status\": \"" + result + "\"}");
//    }
//
//    // TPO: Tracker View
//    @GetMapping("/applications")
//    public ResponseEntity<List<Application>> getTracker() {
//        return ResponseEntity.ok(service.getAllApplications());
//    }
//
//    // TPO: Company-wise Application Tracker
//    @GetMapping("/company-wise")
//    public List<CompanyApplicationsDTO> getApplicationsCompanyWise() {
//
//        List<Application> allApps = applicationRepo.findAll();
//
//        Map<String, List<Application>> grouped =
//                allApps.stream()
//                        .collect(Collectors.groupingBy(
//                                a -> a.getNotification().getCompanyName()
//                        ));
//
//        return grouped.entrySet()
//                .stream()
//                .map(e -> new CompanyApplicationsDTO(e.getKey(), e.getValue()))
//                .toList();
//    }
//
//
//
//}

package com.placement.management.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.placement.management.entity.*;
import com.placement.management.service.NotificationService;
import com.placement.management.repository.ApplicationRepository;
import com.placement.management.dto.CompanyApplicationsDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.*;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "http://localhost:3000")
public class NotificationController {

    private final NotificationService service;
    private final ApplicationRepository applicationRepo;

    // Directory where PDF files will be stored
    private final String UPLOAD_DIR = "uploads/";

    public NotificationController(NotificationService service, ApplicationRepository applicationRepo) {
        this.service = service;
        this.applicationRepo = applicationRepo;
    }

    /**
     * TPO: Broadcast a new job notification with an optional PDF file.
     */
    @PostMapping("/create-advanced")
    public ResponseEntity<?> createAdvanced(
            @RequestParam("notification") String notificationJson,
            @RequestParam(value = "file", required = false) MultipartFile file) {

        try {
            ObjectMapper mapper = new ObjectMapper();
            mapper.findAndRegisterModules(); // Required for LocalDateTime support
            Notification note = mapper.readValue(notificationJson, Notification.class);

            // 1. Handle File Upload only if it exists
            if (file != null && !file.isEmpty()) {
                Path uploadPath = Paths.get(UPLOAD_DIR).toAbsolutePath().normalize();
                if (!Files.exists(uploadPath)) {
                    Files.createDirectories(uploadPath);
                }

                String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
                Path filePath = uploadPath.resolve(fileName);
                Files.write(filePath, file.getBytes());

                note.setAttachmentPath(fileName);
            }

            Notification savedNote = service.createNotification(note);
            return ResponseEntity.ok(savedNote);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error creating notification: " + e.getMessage());
        }
    }

    /**
     * STUDENT: Fetch notifications filtered by eligibility and date.
     */
    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Notification>> getForStudent(@PathVariable Long studentId) {
        try {
            return ResponseEntity.ok(service.getNotificationsForStudent(studentId));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * STUDENT: Toggle star/bookmark on a notification.
     */
    @PostMapping("/star")
    public ResponseEntity<?> toggleStar(@RequestParam Long studentId, @RequestParam Long noteId) {
        service.toggleStar(studentId, noteId);
        return ResponseEntity.ok(Collections.singletonMap("status", "SUCCESS"));
    }

    @GetMapping("/filter-students")
    public ResponseEntity<List<User>> filterStudents(
            @RequestParam(required = false) String company,
            @RequestParam(required = false) Double minCpi,
            @RequestParam(required = false) CareerPreference pref) {
        return ResponseEntity.ok(service.getFilteredStudents(company, minCpi, pref));
    }

    /**
     * STUDENT: Apply for a job/drive.
     */
    @PostMapping("/apply")
    public ResponseEntity<?> apply(@RequestParam Long studentId, @RequestParam Long noteId) {
        try {
            String result = service.applyToJob(studentId, noteId);
            return ResponseEntity.ok(Collections.singletonMap("status", result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("status", "SERVER_ERROR"));
        }
    }

    /**
     * TPO: Get application tracker (All students).
     */
    @GetMapping("/applications")
    public ResponseEntity<List<Application>> getTracker() {
        return ResponseEntity.ok(applicationRepo.findAll());
    }

    /**
     * TPO: Get application statistics grouped by company.
     */
    @GetMapping("/company-wise")
    public List<CompanyApplicationsDTO> getApplicationsCompanyWise() {
        List<Application> allApps = applicationRepo.findAll();
        Map<String, List<Application>> grouped = allApps.stream()
                .filter(a -> a.getNotification() != null && a.getNotification().getCompanyName() != null)
                .collect(Collectors.groupingBy(a -> a.getNotification().getCompanyName()));

        return grouped.entrySet().stream()
                .map(e -> new CompanyApplicationsDTO(e.getKey(), e.getValue()))
                .collect(Collectors.toList());
    }
}