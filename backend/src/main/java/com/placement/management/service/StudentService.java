//package com.placement.management.service;
//
//import com.placement.management.entity.CareerPreference;
//import com.placement.management.entity.StudentProfile;
//import com.placement.management.entity.User;
//import com.placement.management.repository.StudentProfileRepository;
//import com.placement.management.repository.UserRepository;
//import org.springframework.stereotype.Service;
//import org.springframework.web.multipart.MultipartFile;
//
//import java.io.File;
//import java.util.ArrayList;
//import java.util.List;
//
//@Service
//public class StudentService {
//
//    private final UserRepository userRepo;
//    private final StudentProfileRepository profileRepo;
//
//    public StudentService(UserRepository userRepo,
//                          StudentProfileRepository profileRepo) {
//        this.userRepo = userRepo;
//        this.profileRepo = profileRepo;
//    }
//
//    // =======================
//    // TPO FUNCTIONS
//    // =======================
//
//    public List<User> getAllStudents(String role) {
//
//        if (!"TPO".equalsIgnoreCase(role))
//            throw new RuntimeException("Access denied");
//
//        return userRepo.findByRole("STUDENT");
//    }
//
//    public String deleteStudent(Long id, String role) {
//
//        if (!"TPO".equalsIgnoreCase(role))
//            return "Only TPO can delete students";
//
//        if (!userRepo.existsById(id))
//            return "Student not found";
//
//        userRepo.deleteById(id);
//        return "Student deleted successfully";
//    }
//
//    // =======================
//    // STUDENT PROFILE LOGIC
//    // =======================
//
//    public StudentProfile saveOrUpdateProfile(
//            Long userId,
//            List<String> skills,
//            Double tenthPercentage,
//            Double twelfthPercentage,
//            CareerPreference careerPreference,
//            MultipartFile resume) {
//
//        // 1️⃣ Fetch user
//        User user = userRepo.findById(userId)
//                .orElseThrow(() -> new RuntimeException("User not found"));
//
//        if (!"STUDENT".equalsIgnoreCase(user.getRole())) {
//            throw new RuntimeException("User is not a student");
//        }
//
//        // 2️⃣ Get or create profile
//        StudentProfile profile = profileRepo.findByUser(user)
//                .orElseGet(() -> {
//                    StudentProfile p = new StudentProfile();
//                    p.setUser(user);
//                    p.setSkills(new ArrayList<>());
//                    p.setCareerPreference(CareerPreference.PLACEMENT);
//                    return p;
//                });
//
//        // 3️⃣ Update fields
//        profile.setSkills(skills);
//        profile.setTenthPercentage(tenthPercentage);
//        profile.setTwelfthPercentage(twelfthPercentage);
//        profile.setCareerPreference(careerPreference);
//
//
//        // Inside saveOrUpdateProfile method in StudentService.java
//        if (resume != null && !resume.isEmpty()) {
//            try {
//                // 1. Get the absolute path to the backend folder
//                String rootPath = System.getProperty("user.dir");
//                String uploadDirPath = rootPath + File.separator + "uploads" + File.separator + "resumes";
//
//                File directory = new File(uploadDirPath);
//                if (!directory.exists()) {
//                    directory.mkdirs(); // Creates the folder if it doesn't exist
//                }
//
//                // 2. Create the file name (only the name, not the path)
//                String fileName = userId + "_resume.pdf";
//                File destination = new File(uploadDirPath + File.separator + fileName);
//
//                // 3. Physically save the file
//                resume.transferTo(destination);
//
//                // 4. Save ONLY the filename in the database (e.g., "13_resume.pdf")
//                // Your WebConfig will handle the prefixing automatically
//                profile.setResumePath(fileName);
//
//                System.out.println("File saved successfully at: " + destination.getAbsolutePath());
//
//            } catch (Exception e) {
//                e.printStackTrace();
//                throw new RuntimeException("Resume upload failed: " + e.getMessage());
//            }
//        }
//
//        return profileRepo.save(profile);
//    }
//
//    // =======================
//    // GET PROFILE
//    // =======================
//
//    public StudentProfile getProfile(Long userId) {
//
//        User user = userRepo.findById(userId)
//                .orElseThrow(() -> new RuntimeException("User not found"));
//
//        if (!"STUDENT".equalsIgnoreCase(user.getRole())) {
//            throw new RuntimeException("User is not a student");
//        }
//
//        return profileRepo.findByUser(user)
//                .orElseGet(() -> {
//                    StudentProfile profile = new StudentProfile();
//                    profile.setUser(user);
//                    profile.setSkills(new ArrayList<>());
//                    profile.setCareerPreference(CareerPreference.PLACEMENT);
//                    return profileRepo.save(profile);
//                });
//    }
//}


package com.placement.management.service;

import com.placement.management.dto.StudentDashboardDTO;
import com.placement.management.dto.TPODashboardDTO;
import com.placement.management.entity.*;
import com.placement.management.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class StudentService {

    // These instances must be used for all database calls
    private final UserRepository userRepo;
    private final StudentProfileRepository profileRepo;
    private final ApplicationRepository applicationRepo;
    private final NotificationRepository notificationRepo;

    public StudentService(UserRepository userRepo,
                          StudentProfileRepository profileRepo,
                          ApplicationRepository applicationRepo,
                          NotificationRepository notificationRepo) {
        this.userRepo = userRepo;
        this.profileRepo = profileRepo;
        this.applicationRepo = applicationRepo;
        this.notificationRepo = notificationRepo;
    }

    // =======================
    // FIXED: DASHBOARD LOGIC
    // =======================

    public StudentDashboardDTO getStudentDashboard(Long userId) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Application> apps = applicationRepo.findByStudent(user);

        StudentDashboardDTO dto = new StudentDashboardDTO();
        dto.setName(user.getName());
        dto.setAppliedCount(apps.size());
        dto.setOffersCount(apps.stream().filter(a -> a.getStatus() == ApplicationStatus.SELECTED).count());
        dto.setPendingCount(apps.stream().filter(a -> a.getStatus() == ApplicationStatus.PENDING).count());

        // Fix: Change getStudentRole() to getCompanyName()
        dto.setApplications(apps.stream().map(a -> new StudentDashboardDTO.AppDetail(
                a.getNotification().getCompanyName(), // ✅ THIS IS THE FIX
                a.getStatus().name(),
                a.getAppliedAt().toLocalDate().toString()
        )).collect(Collectors.toList()));

        return dto;
    }

    public TPODashboardDTO getTPODashboard() {
        // Use userRepo instance to fix the red error in your screenshot
        long totalStudents = userRepo.countByRole("STUDENT");

        // Use notificationRepo instance
        long totalCompanies = notificationRepo.count();

        List<Application> allApplications = applicationRepo.findAll();

        long placedCount = allApplications.stream()
                .filter(a -> a.getStatus() == ApplicationStatus.SELECTED)
                .map(a -> a.getStudent().getId())
                .distinct()
                .count();

        long unplacedCount = totalStudents - placedCount;

        TPODashboardDTO dto = new TPODashboardDTO();
        dto.setTotalStudents(totalStudents);
        dto.setPlacedCount(placedCount);
        dto.setUnplacedCount(unplacedCount);
        dto.setTotalCompanies(totalCompanies);

        // Data for Recharts
        dto.setChartData(List.of(
                Map.of("name", "Placed", "value", placedCount),
                Map.of("name", "Unplaced", "value", unplacedCount)
        ));

        return dto;
    }

    // =======================
    // TPO FUNCTIONS (EXISTING)
    // =======================

    public List<User> getAllStudents(String role) {
        if (!"TPO".equalsIgnoreCase(role))
            throw new RuntimeException("Access denied");
        return userRepo.findByRole("STUDENT");
    }

    public String deleteStudent(Long id, String role) {
        if (!"TPO".equalsIgnoreCase(role))
            return "Only TPO can delete students";
        if (!userRepo.existsById(id))
            return "Student not found";
        userRepo.deleteById(id);
        return "Student deleted successfully";
    }

    // =======================
    // STUDENT PROFILE LOGIC
    // =======================

    public StudentProfile saveOrUpdateProfile(
            Long userId,
            List<String> skills,
            Double tenthPercentage,
            Double twelfthPercentage,
            CareerPreference careerPreference,
            MultipartFile resume) {

        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!"STUDENT".equalsIgnoreCase(user.getRole())) {
            throw new RuntimeException("User is not a student");
        }

        StudentProfile profile = profileRepo.findByUser(user)
                .orElseGet(() -> {
                    StudentProfile p = new StudentProfile();
                    p.setUser(user);
                    p.setSkills(new ArrayList<>());
                    p.setCareerPreference(CareerPreference.PLACEMENT);
                    return p;
                });

        profile.setSkills(skills);
        profile.setTenthPercentage(tenthPercentage);
        profile.setTwelfthPercentage(twelfthPercentage);
        profile.setCareerPreference(careerPreference);

        if (resume != null && !resume.isEmpty()) {
            try {
                String rootPath = System.getProperty("user.dir");
                String uploadDirPath = rootPath + File.separator + "uploads" + File.separator + "resumes";

                File directory = new File(uploadDirPath);
                if (!directory.exists()) directory.mkdirs();

                String fileName = userId + "_resume.pdf";
                File destination = new File(uploadDirPath + File.separator + fileName);
                resume.transferTo(destination);
                profile.setResumePath(fileName);

            } catch (Exception e) {
                throw new RuntimeException("Resume upload failed: " + e.getMessage());
            }
        }

        return profileRepo.save(profile);
    }

    public StudentProfile getProfile(Long userId) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!"STUDENT".equalsIgnoreCase(user.getRole())) {
            throw new RuntimeException("User is not a student");
        }

        return profileRepo.findByUser(user)
                .orElseGet(() -> {
                    StudentProfile profile = new StudentProfile();
                    profile.setUser(user);
                    profile.setSkills(new ArrayList<>());
                    profile.setCareerPreference(CareerPreference.PLACEMENT);
                    return profileRepo.save(profile);
                });
    }
}