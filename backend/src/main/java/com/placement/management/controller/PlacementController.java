package com.placement.management.controller;

import com.placement.management.dto.PlacementDTO;
import com.placement.management.dto.PlacementSummaryDTO;
import com.placement.management.entity.Notification;
import com.placement.management.entity.PlacementRecord;
import com.placement.management.entity.User;
import com.placement.management.repository.NotificationRepository;
import com.placement.management.repository.PlacementSummaryRepository;
import com.placement.management.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/placements")
@CrossOrigin(origins = "http://localhost:3000")
public class PlacementController {

    private final PlacementSummaryRepository placementRepo;
    private final UserRepository userRepo;
    private final NotificationRepository notificationRepo;

    public PlacementController(
            PlacementSummaryRepository placementRepo,
            UserRepository userRepo,
            NotificationRepository notificationRepo
    ) {
        this.placementRepo = placementRepo;
        this.userRepo = userRepo;
        this.notificationRepo = notificationRepo;
    }

    @PostMapping("/save")
    public ResponseEntity<?> savePlacement(@RequestBody PlacementDTO dto) {

        if (dto.getJobId() == null || dto.getStudentId() == null || dto.getFinalCtc() == null) {
            return ResponseEntity.badRequest().body("jobId, studentId, finalCtc required");
        }

        User student = userRepo.findById(dto.getStudentId())
                .orElseThrow(() -> new RuntimeException("Student not found"));

        Notification job = notificationRepo.findById(dto.getJobId())
                .orElseThrow(() -> new RuntimeException("Job not found"));

        // ✅ FIX: UPDATE if already exists
        PlacementRecord placement = placementRepo
                .findByStudentIdAndNotificationId(dto.getStudentId(), dto.getJobId())
                .orElse(new PlacementRecord());

        placement.setStudent(student);
        placement.setNotification(job);
        placement.setFinalCtc(dto.getFinalCtc());
        placement.setSelectionDate(java.time.LocalDateTime.now());

        placementRepo.save(placement);

        return ResponseEntity.ok("PLACEMENT_SAVED_OR_UPDATED");
    }


    // ✅ PLACEMENT SUMMARY FOR FRONTEND TABLE
    @GetMapping("/summary")
    public ResponseEntity<List<PlacementSummaryDTO>> getSummary() {

        List<PlacementSummaryDTO> list = placementRepo.findAll().stream()
                .map(p -> new PlacementSummaryDTO(
                        p.getId(),
                        p.getStudent().getName(),
                        p.getNotification().getCompanyName(),
                        p.getFinalCtc()
                ))
                .toList();

        return ResponseEntity.ok(list);
    }


}
