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

    // 1. TPO: Get list of applicants for a job
    @GetMapping("/job/{jobId}/applicants")
    public ResponseEntity<List<Application>> getApplicants(@PathVariable Long jobId) {
        return ResponseEntity.ok(applicationRepo.findByJobIdWithStudents(jobId));
    }

    // 2. TPO: Bulk update (The Checkbox Logic)
    @PostMapping("/bulk-selection")
    public ResponseEntity<?> bulkUpdate(@RequestBody BulkSelectionDTO_V2 dto) {
        try {
            bulkService.updateStudentStatuses(dto);
            return ResponseEntity.ok(Map.of("message", "Status updated successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    // 3. STUDENT: View history
    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Application>> getStudentApplications(@PathVariable Long studentId) {
        User student = userRepo.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        return ResponseEntity.ok(applicationRepo.findByStudent(student));
    }
}