package com.placement.management.service;

import com.placement.management.entity.Application;
import com.placement.management.entity.Notification;
import com.placement.management.entity.User;
import com.placement.management.repository.ApplicationRepository;
import com.placement.management.repository.NotificationRepository;
import com.placement.management.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

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

    // ✅ Student: Apply for a job (notification)
    @Transactional
    public String apply(Long studentId, Long notificationId) {

        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        // Prevent duplicate apply
        boolean alreadyApplied = applicationRepository
                .findByStudentAndNotification(student, notification)
                .isPresent();

        if (alreadyApplied) {
            return "ALREADY_APPLIED";
        }

        Application application = new Application(student, notification);
        applicationRepository.save(application);

        return "APPLIED_SUCCESS";
    }

    // ✅ Student: View applied jobs
    public List<Application> getStudentApplications(Long studentId) {

        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        return applicationRepository.findByStudent(student);
    }
}
