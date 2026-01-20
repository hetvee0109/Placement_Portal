package com.placement.management.controller;

import com.placement.management.entity.Application;
import com.placement.management.entity.User;
import com.placement.management.repository.ApplicationRepository;
import com.placement.management.repository.UserRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/job-applications")
@CrossOrigin(origins = "http://localhost:3000")
public class JobApplicationController {

    private final ApplicationRepository applicationRepo;
    private final UserRepository userRepo;

    public JobApplicationController(ApplicationRepository applicationRepo,
                                    UserRepository userRepo) {
        this.applicationRepo = applicationRepo;
        this.userRepo = userRepo;
    }

    // STUDENT: View applied companies
    @GetMapping("/student/{studentId}")
    public List<Application> getStudentApplications(@PathVariable Long studentId) {
        User student = userRepo.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        return applicationRepo.findByStudent(student);
    }
}
