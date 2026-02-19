package com.placement.management.controller;

import com.placement.management.entity.Application;
import com.placement.management.entity.User;
import com.placement.management.repository.ApplicationRepository;
import com.placement.management.repository.UserRepository;
import com.placement.management.service.ApplicationService;
import com.placement.management.service.BulkApplicationService_V2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.placement.management.dto.BulkSelectionDTO_V2;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/applications")
@CrossOrigin(origins = "http://localhost:3000")
public class ApplicationController {

    private final ApplicationRepository applicationRepo;
    private final UserRepository userRepo;
    private final ApplicationService applicationService;

    @Autowired
    private BulkApplicationService_V2 bulkService;

    public ApplicationController(ApplicationRepository applicationRepo,
                                 UserRepository userRepo,
                                 ApplicationService applicationService) {
        this.applicationRepo = applicationRepo;
        this.userRepo = userRepo;
        this.applicationService = applicationService;
    }

    @GetMapping("/job/{jobId}/applicants")
    public ResponseEntity<List<Application>> getApplicants(@PathVariable Long jobId) {
        return ResponseEntity.ok(applicationRepo.findByJobIdWithStudents(jobId));
    }

    @PostMapping("/bulk-selection")
    public ResponseEntity<?> bulkUpdate(@RequestBody BulkSelectionDTO_V2 dto) {
        try {
            bulkService.updateStudentStatuses(dto);
            return ResponseEntity.ok(Map.of("message", "Status updated successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Application>> getStudentApplications(@PathVariable Long studentId) {
        User student = userRepo.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        return ResponseEntity.ok(applicationRepo.findByStudent(student));
    }

    // ✅ FIXED: Using correct repo and added directory check
    @PostMapping("/{id}/upload-offer")
    public ResponseEntity<?> uploadOfferLetter(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
        try {
            String uploadDir = "uploads/offer_letters/";
            File dir = new File(uploadDir);
            if (!dir.exists()) dir.mkdirs();

            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            Path path = Paths.get(uploadDir + fileName);
            Files.copy(file.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);

            // Using applicationRepo variable defined in your class
            Application app = applicationRepo.findById(id)
                    .orElseThrow(() -> new RuntimeException("Application not found"));

            app.setOfferLetterPath(fileName);
            applicationRepo.save(app);

            return ResponseEntity.ok(Map.of("message", "Uploaded successfully", "fileName", fileName));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Upload failed: " + e.getMessage()));
        }
    }
}