//package com.placement.management.service;
//
//import com.placement.management.entity.User;
//import com.placement.management.repository.UserRepository;
//import org.springframework.stereotype.Service;
//
//import java.util.List;
//
//@Service
//public class StudentService {
//
//    private final UserRepository repo;
//
//    public StudentService(UserRepository repo) {
//        this.repo = repo;
//    }
//
//    // Only TPO can view students
//    public List<User> getAllStudents(String role) {
//
//        if (!"TPO".equalsIgnoreCase(role))
//            throw new RuntimeException("Access denied");
//
//        return repo.findByRole("STUDENT");
//    }
//
//    // Only TPO can delete students
//    public String deleteStudent(Long id, String role) {
//
//        if (!"TPO".equalsIgnoreCase(role))
//            return "Only TPO can delete students";
//
//        if (!repo.existsById(id))
//            return "Student not found";
//
//        repo.deleteById(id);
//        return "Student deleted successfully";
//    }
//}

package com.placement.management.service;

import com.placement.management.entity.CareerPreference;
import com.placement.management.entity.StudentProfile;
import com.placement.management.entity.User;
import com.placement.management.repository.StudentProfileRepository;
import com.placement.management.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

@Service
public class StudentService {

    private final UserRepository userRepo;
    private final StudentProfileRepository profileRepo;

    public StudentService(UserRepository userRepo,
                          StudentProfileRepository profileRepo) {
        this.userRepo = userRepo;
        this.profileRepo = profileRepo;
    }

    // =======================
    // TPO FUNCTIONS
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

        // 1️⃣ Fetch user
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!"STUDENT".equalsIgnoreCase(user.getRole())) {
            throw new RuntimeException("User is not a student");
        }

        // 2️⃣ Get or create profile
        StudentProfile profile = profileRepo.findByUser(user)
                .orElseGet(() -> {
                    StudentProfile p = new StudentProfile();
                    p.setUser(user);
                    p.setSkills(new ArrayList<>());
                    p.setCareerPreference(CareerPreference.PLACEMENT);
                    return p;
                });

        // 3️⃣ Update fields
        profile.setSkills(skills);
        profile.setTenthPercentage(tenthPercentage);
        profile.setTwelfthPercentage(twelfthPercentage);
        profile.setCareerPreference(careerPreference);

        // 4️⃣ Resume upload (PDF only)
        if (resume != null && !resume.isEmpty()) {

            if (!"application/pdf".equalsIgnoreCase(resume.getContentType())) {
                throw new RuntimeException("Only PDF files are allowed");
            }

            try {
                String uploadDir = "src/main/resources/static/resumes/";
                File directory = new File(uploadDir);
                if (!directory.exists()) directory.mkdirs();

                String fileName = userId + "_resume.pdf";
                File destination = new File(uploadDir + fileName);

                resume.transferTo(destination);
                profile.setResumePath("/resumes/" + fileName);

            } catch (Exception e) {
                throw new RuntimeException("Resume upload failed");
            }
        }

        return profileRepo.save(profile);
    }

    // =======================
    // GET PROFILE
    // =======================

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


