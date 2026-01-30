package com.placement.management.repository;

import com.placement.management.entity.PlacementRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PlacementSummaryRepository extends JpaRepository<PlacementRecord, Long> {
}