package com.placement.management.repository;

import com.placement.management.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    @Query("SELECT COUNT(DISTINCT n.companyName) FROM Notification n")
    long countDistinctCompanyName();
}