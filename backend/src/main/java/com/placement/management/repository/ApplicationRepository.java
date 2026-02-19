package com.placement.management.repository;

import com.placement.management.entity.Application;
import com.placement.management.entity.ApplicationStatus;
import com.placement.management.entity.Notification;
import com.placement.management.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {

    // Student View
    List<Application> findByStudent(User student);

    Optional<Application> findByStudentAndNotification(User student, Notification notification);

    // TPO View: get all applicants for a job
    @Query("SELECT a FROM Application a JOIN FETCH a.student WHERE a.notification.id = :jobId")
    List<Application> findByJobIdWithStudents(@Param("jobId") Long jobId);

    // STEP 1: Reject all for that job
    @Modifying
    @Transactional
    @Query("UPDATE Application a SET a.status = com.placement.management.entity.ApplicationStatus.REJECTED WHERE a.notification.id = :jobId")
    int markAllAsRejected(@Param("jobId") Long jobId);

    // STEP 2: Select checked students only
    @Modifying
    @Transactional
    @Query("UPDATE Application a SET a.status = com.placement.management.entity.ApplicationStatus.SELECTED WHERE a.notification.id = :jobId AND a.student.id IN :studentIds")
    int markSelectedStudents(@Param("jobId") Long jobId,
                             @Param("studentIds") List<Long> studentIds);

    // Already placed students
    @Query("SELECT a.student.id FROM Application a WHERE a.status = com.placement.management.entity.ApplicationStatus.SELECTED")
    List<Long> findAlreadyPlacedStudentIds();

    void deleteByStudentId(Long studentId);

    // Inside ApplicationRepository.java
    Optional<Application> findTopByStudentIdAndStatusAndNotificationIdNot(Long studentId, ApplicationStatus status, Long notificationId);
}
