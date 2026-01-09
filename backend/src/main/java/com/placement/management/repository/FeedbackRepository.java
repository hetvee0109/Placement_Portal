package com.placement.management.repository;

import com.placement.management.entity.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    // Find the latest feedback for a specific student
    Optional<Feedback> findTopByStudentIdOrderByCreatedAtDesc(Long studentId);
}