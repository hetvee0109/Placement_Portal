package com.placement.management.service;

import com.placement.management.entity.Feedback;
import com.placement.management.repository.FeedbackRepository;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class FeedbackService {

    private final FeedbackRepository feedbackRepo;

    public FeedbackService(FeedbackRepository feedbackRepo) {
        this.feedbackRepo = feedbackRepo;
    }

    public void addFeedback(Long studentId, String comment) {
        Feedback feedback = new Feedback(studentId, comment);
        feedbackRepo.save(feedback);
    }

    public String getLatestFeedback(Long studentId) {
        return feedbackRepo.findTopByStudentIdOrderByCreatedAtDesc(studentId)
                .map(Feedback::getComment)
                .orElse("No feedback yet");
    }
}