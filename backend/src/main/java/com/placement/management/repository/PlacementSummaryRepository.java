package com.placement.management.repository;

import com.placement.management.entity.PlacementRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PlacementSummaryRepository extends JpaRepository<PlacementRecord, Long> {

    Optional<PlacementRecord> findByStudentIdAndNotificationId(Long studentId, Long notificationId);
}
