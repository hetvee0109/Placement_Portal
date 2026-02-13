package com.placement.management.controller;

import com.placement.management.dto.BulkSelectionDTO_V2;
import com.placement.management.entity.Application;
import com.placement.management.service.BulkApplicationService_V2;
import com.placement.management.repository.ApplicationRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v2/applications")
@CrossOrigin(origins = "http://localhost:3000")
public class BulkApplicationController_V2 {

    private final BulkApplicationService_V2 bulkService;
    private final ApplicationRepository applicationRepository;

    public BulkApplicationController_V2(BulkApplicationService_V2 bulkService,
                                        ApplicationRepository applicationRepository) {
        this.bulkService = bulkService;
        this.applicationRepository = applicationRepository;
    }

    @PostMapping("/bulk-update")
    public ResponseEntity<?> updateSelection(@RequestBody BulkSelectionDTO_V2 dto) {

        if (dto.getJobId() == null) {
            return ResponseEntity.badRequest().body("jobId is required");
        }

        bulkService.updateStudentStatuses(dto);
        return ResponseEntity.ok("Success");
    }

    @GetMapping("/job/{jobId}/applicants")
    public ResponseEntity<List<Application>> getApplicants(@PathVariable Long jobId) {
        List<Application> applications = applicationRepository.findByJobIdWithStudents(jobId);
        return ResponseEntity.ok(applications);
    }
}
