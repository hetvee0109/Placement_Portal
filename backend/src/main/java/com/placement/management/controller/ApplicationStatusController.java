package com.placement.management.controller;

import com.placement.management.entity.Application;
import com.placement.management.entity.ApplicationStatus;
import com.placement.management.repository.ApplicationRepository;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/application-status")
@CrossOrigin(origins = "http://localhost:3000")
public class ApplicationStatusController {

    private final ApplicationRepository applicationRepo;

    public ApplicationStatusController(ApplicationRepository applicationRepo) {
        this.applicationRepo = applicationRepo;
    }

    // TPO: Update application status
    @PostMapping("/update")
    public String updateStatus(
            @RequestParam Long applicationId,
            @RequestParam ApplicationStatus status
    ) {
        Application app = applicationRepo.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        app.setStatus(status);
        applicationRepo.save(app);

        return "STATUS_UPDATED";
    }
}
