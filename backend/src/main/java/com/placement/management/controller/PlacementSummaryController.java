package com.placement.management.controller;

import com.placement.management.entity.*;
import com.placement.management.repository.*;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/placements")
@CrossOrigin(origins = "http://localhost:3000")
public class PlacementSummaryController {

    private final PlacementSummaryRepository placementRepo;
    private final ApplicationRepository appRepo;

    public PlacementSummaryController(PlacementSummaryRepository placementRepo, ApplicationRepository appRepo) {
        this.placementRepo = placementRepo;
        this.appRepo = appRepo;
    }

    @GetMapping("/summary")
    public List<PlacementRecord> getSummary() {
        return placementRepo.findAll();
    }

    @PostMapping("/select-student/{appId}")
    public PlacementRecord selectStudent(@PathVariable Long appId, @RequestParam Double ctc) {
        Application app = appRepo.findById(appId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        // Update Application Status (reflects in student portal)
        app.setStatus(ApplicationStatus.SELECTED);
        appRepo.save(app);

        // Create the Summary Record
        PlacementRecord record = new PlacementRecord();
        record.setStudentName(app.getStudent().getName());
        record.setStudentEmail(app.getStudent().getEmail());
        record.setCompanyName(app.getNotification().getCompanyName());
        record.setFinalCtc(ctc);

        return placementRepo.save(record);
    }
}