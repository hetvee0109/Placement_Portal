package com.placement.management.controller;

import com.placement.management.service.FeedbackService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/feedback")
@CrossOrigin(origins = "http://localhost:3000")
public class FeedbackController {

    private final FeedbackService feedbackService;

    public FeedbackController(FeedbackService feedbackService) {
        this.feedbackService = feedbackService;
    }

    // TPO calls this: POST http://localhost:8080/api/feedback/submit
    @PostMapping("/submit")
    public ResponseEntity<?> submitFeedback(@RequestParam Long studentId, @RequestBody String comment) {
        feedbackService.addFeedback(studentId, comment);
        return ResponseEntity.ok("{\"message\": \"Feedback saved\"}");
    }

    // Student calls this: GET http://localhost:8080/api/feedback/student/12
    @GetMapping("/student/{studentId}")
    public ResponseEntity<String> fetchFeedback(@PathVariable Long studentId) {
        return ResponseEntity.ok(feedbackService.getLatestFeedback(studentId));
    }
}