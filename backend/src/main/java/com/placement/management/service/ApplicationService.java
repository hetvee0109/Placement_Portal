package com.placement.management.service;

import com.placement.management.entity.Application;
import com.placement.management.entity.ApplicationStatus;
import com.placement.management.entity.Notification;
import com.placement.management.entity.User;
import com.placement.management.repository.ApplicationRepository;
import com.placement.management.repository.NotificationRepository;
import com.placement.management.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final UserRepository userRepository;
    private final NotificationRepository notificationRepository;

    public ApplicationService(ApplicationRepository applicationRepository,
                              UserRepository userRepository,
                              NotificationRepository notificationRepository) {
        this.applicationRepository = applicationRepository;
        this.userRepository = userRepository;
        this.notificationRepository = notificationRepository;
    }

    // Student: Apply for a job
    @Transactional
    public String apply(Long studentId, Long notificationId) {
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        boolean alreadyApplied = applicationRepository
                .findByStudentAndNotification(student, notification)
                .isPresent();

        if (alreadyApplied) return "ALREADY_APPLIED";

        Application application = new Application(student, notification);
        applicationRepository.save(application);
        return "APPLIED_SUCCESS";
    }

    // TPO: Get applicants with "Red Status" detection
    public List<Application> getApplicantsWithCrossStatus(Long jobId) {
        // Fetch all applicants for this specific job
        List<Application> currentApplicants = applicationRepository.findByJobIdWithStudents(jobId);

        for (Application app : currentApplicants) {
            Long studentId = app.getStudent().getId();

            // Find if this student is 'SELECTED' in any company EXCEPT the current jobId
            // We use the status "SELECTED" to trigger the red warning in React
            Optional<Application> otherPlacement = applicationRepository
                    .findTopByStudentIdAndStatusAndNotificationIdNot(studentId, ApplicationStatus.SELECTED, jobId);

            if (otherPlacement.isPresent()) {
                app.setSelectedInOtherCompany(true);
                app.setOtherCompanyName(otherPlacement.get().getNotification().getCompanyName());
            }
        }
        return currentApplicants;
    }

    //Student: View history
    public List<Application> getStudentApplications(Long studentId) {
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        return applicationRepository.findByStudent(student);
    }
}