//package com.placement.management.controller;
//
//import com.placement.management.entity.*;
//import com.placement.management.service.NotificationService;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//import java.util.List;
//
//@RestController
//@RequestMapping("/api/notifications")
//@CrossOrigin(origins = "http://localhost:3000")
//public class NotificationController {
//
//    private final NotificationService service;
//
//    public NotificationController(NotificationService service) {
//        this.service = service;
//    }
//
//    // TPO: Create Notification
//    @PostMapping("/create")
//    public ResponseEntity<Notification> create(@RequestBody Notification note) {
//        return ResponseEntity.ok(service.createNotification(note));
//    }
//
//    // STUDENT: Get filtered notifications
//    @GetMapping("/student/{studentId}")
//    public ResponseEntity<List<Notification>> getForStudent(@PathVariable Long studentId) {
//        return ResponseEntity.ok(service.getNotificationsForStudent(studentId));
//    }
//
//    // STUDENT: Apply
//    @PostMapping("/apply")
//    public ResponseEntity<?> apply(@RequestParam Long studentId, @RequestParam Long noteId) {
//        String result = service.applyToJob(studentId, noteId);
//        return ResponseEntity.ok("{\"status\": \"" + result + "\"}");
//    }
//
//    // TPO: Tracker
//    @GetMapping("/applications")
//    public ResponseEntity<List<Application>> getTracker() {
//        return ResponseEntity.ok(service.getAllApplications());
//    }
//}

package com.placement.management.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.placement.management.entity.*;
import com.placement.management.entity.Application;
import com.placement.management.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "http://localhost:3000")
public class NotificationController {

    private final NotificationService service;
    private final String UPLOAD_DIR = "uploads/resumes/";

    public NotificationController(NotificationService service) {
        this.service = service;
    }

    // TPO: Advanced Create (Supports JSON + PDF File)
    @PostMapping("/create-advanced")
    public ResponseEntity<Notification> createAdvanced(
            @RequestParam("notification") String notificationJson,
            @RequestParam(value = "file", required = false) MultipartFile file) throws IOException {

        ObjectMapper mapper = new ObjectMapper();
        mapper.findAndRegisterModules(); // Support for LocalDateTime
        Notification note = mapper.readValue(notificationJson, Notification.class);

        if (file != null && !file.isEmpty()) {
            String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Path path = Paths.get(UPLOAD_DIR + fileName);
            Files.createDirectories(path.getParent());
            Files.write(path, file.getBytes());
            note.setAttachmentPath(fileName);
        }

        return ResponseEntity.ok(service.createNotification(note));
    }

    // TPO: Filter Students for Private Mode Selection
    @GetMapping("/filter-students")
    public ResponseEntity<List<User>> filterStudents(
            @RequestParam(required = false) String company,
            @RequestParam(required = false) Double minCpi,
            @RequestParam(required = false) CareerPreference pref) {
        return ResponseEntity.ok(service.getFilteredStudents(company, minCpi, pref));
    }

    // STUDENT: Get notifications with 7-day auto-expiry / Star persistence logic
    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Notification>> getForStudent(@PathVariable Long studentId) {
        return ResponseEntity.ok(service.getNotificationsForStudent(studentId));
    }

    // STUDENT: Star/Unstar a notification
    @PostMapping("/star")
    public ResponseEntity<?> toggleStar(@RequestParam Long studentId, @RequestParam Long noteId) {
        service.toggleStar(studentId, noteId);
        return ResponseEntity.ok("{\"status\": \"SUCCESS\"}");
    }

    // STUDENT: Apply to Job Drive
    @PostMapping("/apply")
    public ResponseEntity<?> apply(@RequestParam Long studentId, @RequestParam Long noteId) {
        String result = service.applyToJob(studentId, noteId);
        return ResponseEntity.ok("{\"status\": \"" + result + "\"}");
    }

    // TPO: Tracker View
    @GetMapping("/applications")
    public ResponseEntity<List<Application>> getTracker() {
        return ResponseEntity.ok(service.getAllApplications());
    }
}