package com.placement.management.repository;

import com.placement.management.entity.Application;
import com.placement.management.entity.Notification;
import com.placement.management.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {
    // Check if a student has already applied to a specific notification
    Optional<Application> findByStudentAndNotification(User student, Notification notification);

    @Query("SELECT a FROM Application a WHERE (:company IS NULL OR a.notification.companyName LIKE %:company%)")
    List<Application> findByCompanyName(@Param("company") String company);

    // ADD this method (do not remove existing ones)
    List<Application> findByStudent(User student);

}