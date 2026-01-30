////
////package com.placement.management.service;
////
////import com.placement.management.entity.*;
////import com.placement.management.repository.*;
////import org.springframework.stereotype.Service;
////import org.springframework.transaction.annotation.Transactional;
////import java.time.LocalDateTime;
////import java.util.List;
////import java.util.stream.Collectors;
////
////@Service
////public class NotificationService {
////    private final NotificationRepository notificationRepo;
////    private final ApplicationRepository applicationRepo;
////    private final UserRepository userRepo;
////    private final StudentProfileRepository profileRepo;
////
////    public NotificationService(NotificationRepository notificationRepo, ApplicationRepository applicationRepo,
////                               UserRepository userRepo, StudentProfileRepository profileRepo) {
////        this.notificationRepo = notificationRepo;
////        this.applicationRepo = applicationRepo;
////        this.userRepo = userRepo;
////        this.profileRepo = profileRepo;
////    }
////
////    public Notification createNotification(Notification note) {
////        return notificationRepo.save(note);
////    }
////
////    @Transactional
////    public void toggleStar(Long studentId, Long noteId) {
////        Notification note = notificationRepo.findById(noteId).orElseThrow();
////        if (note.getStarredByStudentIds().contains(studentId)) {
////            note.getStarredByStudentIds().remove(studentId);
////        } else {
////            note.getStarredByStudentIds().add(studentId);
////        }
////        notificationRepo.save(note);
////    }
////
////    public List<Notification> getNotificationsForStudent(Long studentId) {
////        User student = userRepo.findById(studentId).orElseThrow();
////        StudentProfile profile = profileRepo.findByUser(student).orElseThrow();
////        LocalDateTime sevenDaysAgo = LocalDateTime.now().minusDays(7);
////
////        return notificationRepo.findAll().stream()
////                .filter(note -> {
////                    // Persistent Star Logic: Keep if starred, else delete if > 7 days old
////                    boolean isStarred = note.getStarredByStudentIds().contains(studentId);
////                    if (!isStarred && note.getCreatedAt().isBefore(sevenDaysAgo)) return false;
////
////                    // Mode filtering
////                    if ("PUBLIC".equalsIgnoreCase(note.getMode())) {
////                        return note.getEligibilityType().equals(profile.getCareerPreference());
////                    }
////                    return note.getTargetStudentIds() != null && note.getTargetStudentIds().contains(studentId);
////                })
////                .collect(Collectors.toList());
////    }
////
////    // TPO Filtering Logic
////    public List<User> getFilteredStudents(String companyName, Double minCpi, CareerPreference pref) {
////        return userRepo.findAll().stream()
////                .filter(u -> u.getRole().equals("STUDENT"))
////                .filter(u -> minCpi == null || (u.getCpi() != null && u.getCpi() >= minCpi))
////                .filter(u -> {
////                    if (companyName == null || companyName.isEmpty()) return true;
////                    // Check if student applied to this specific company
////                    return applicationRepo.findAll().stream()
////                            .anyMatch(app -> app.getStudent().getId().equals(u.getId()) &&
////                                    app.getNotification().getCompanyName().equalsIgnoreCase(companyName));
////                })
////                .collect(Collectors.toList());
////    }
////
////    // Standard Apply Logic
////    public String applyToJob(Long studentId, Long notificationId) {
////        User student = userRepo.findById(studentId).orElseThrow();
////        Notification note = notificationRepo.findById(notificationId).orElseThrow();
////        StudentProfile profile = profileRepo.findByUser(student).orElseThrow();
////
////        if (student.getCpi() == null || student.getCpi() < note.getMinCpi()) return "INELIGIBLE_CPI";
////        if (!profile.getCareerPreference().equals(note.getEligibilityType())) return "INELIGIBLE_PREFERENCE";
////        if (applicationRepo.findByStudentAndNotification(student, note).isPresent()) return "ALREADY_APPLIED";
////
////        applicationRepo.save(new Application(student, note));
////        return "SUCCESS";
////    }
////
////    public List<Application> getAllApplications() {
////        return applicationRepo.findAll();
////    }
////
////    public List<Application> getApplicationsByCompany(String company) {
////        if (company == null || company.isEmpty()) {
////            return applicationRepo.findAll();
////        }
////        return applicationRepo.findByCompanyName(company);
////    }
////}
//
//package com.placement.management.service;
//
//import com.placement.management.entity.*;
//import com.placement.management.repository.*;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//import java.time.LocalDateTime;
//import java.util.List;
//import java.util.stream.Collectors;
//
//@Service
//public class NotificationService {
//    private final NotificationRepository notificationRepo;
//    private final ApplicationRepository applicationRepo;
//    private final UserRepository userRepo;
//    private final StudentProfileRepository profileRepo;
//
//    public NotificationService(NotificationRepository notificationRepo, ApplicationRepository applicationRepo,
//                               UserRepository userRepo, StudentProfileRepository profileRepo) {
//        this.notificationRepo = notificationRepo;
//        this.applicationRepo = applicationRepo;
//        this.userRepo = userRepo;
//        this.profileRepo = profileRepo;
//    }
//
//    public Notification createNotification(Notification note) {
//        return notificationRepo.save(note);
//    }
//
//    @Transactional
//    public void toggleStar(Long studentId, Long noteId) {
//        Notification note = notificationRepo.findById(noteId).orElseThrow();
//        if (note.getStarredByStudentIds().contains(studentId)) {
//            note.getStarredByStudentIds().remove(studentId);
//        } else {
//            note.getStarredByStudentIds().add(studentId);
//        }
//        notificationRepo.save(note);
//    }
//
//    public List<Notification> getNotificationsForStudent(Long studentId) {
//        User student = userRepo.findById(studentId).orElseThrow();
//        StudentProfile profile = profileRepo.findByUser(student).orElse(null);
//        LocalDateTime sevenDaysAgo = LocalDateTime.now().minusDays(7);
//
//        return notificationRepo.findAll().stream()
//                .filter(note -> {
//                    // 1. Persistent Star Logic
//                    boolean isStarred = note.getStarredByStudentIds().contains(studentId);
//                    if (!isStarred && note.getCreatedAt().isBefore(sevenDaysAgo)) return false;
//
//                    // 2. Career Path Matching (Fix: Handle BOTH)
//                    boolean pathMatch = note.getEligibilityType() == CareerPreference.BOTH ||
//                            (profile != null && note.getEligibilityType() == profile.getCareerPreference());
//
//                    // 3. Mode filtering
//                    if ("PUBLIC".equalsIgnoreCase(note.getMode())) {
//                        return pathMatch;
//                    }
//                    return note.getTargetStudentIds() != null && note.getTargetStudentIds().contains(studentId);
//                })
//                .collect(Collectors.toList());
//    }
//
//    public String applyToJob(Long studentId, Long notificationId) {
//        User student = userRepo.findById(studentId).orElseThrow();
//        Notification note = notificationRepo.findById(notificationId).orElseThrow();
//        StudentProfile profile = profileRepo.findByUser(student).orElse(null);
//
//        // Security Check 1: Profile Completeness
//        if (profile == null || profile.getTenthPercentage() == null || profile.getTwelfthPercentage() == null) {
//            return "PROFILE_INCOMPLETE";
//        }
//
//        // Security Check 2: Career Path Match
//        boolean pathMatch = note.getEligibilityType() == CareerPreference.BOTH ||
//                note.getEligibilityType() == profile.getCareerPreference();
//        if (!pathMatch) return "INELIGIBLE_PREFERENCE";
//
//        // Security Check 3: Academic Criteria (CPI, 10th, 12th)
//        if (student.getCpi() == null || student.getCpi() < note.getMinCpi()) return "INELIGIBLE_CPI";
//        if (profile.getTenthPercentage() < note.getMin10thPercent()) return "INELIGIBLE_10TH";
//        if (profile.getTwelfthPercentage() < note.getMin12thPercent()) return "INELIGIBLE_12TH";
//
//        // Check if already applied
//        if (applicationRepo.findByStudentAndNotification(student, note).isPresent()) return "ALREADY_APPLIED";
//
//        applicationRepo.save(new Application(student, note));
//        return "SUCCESS";
//    }
//
//    // TPO Filtering Logic
//    public List<User> getFilteredStudents(String companyName, Double minCpi, CareerPreference pref) {
//        return userRepo.findAll().stream()
//                .filter(u -> u.getRole().equals("STUDENT"))
//                .filter(u -> minCpi == null || (u.getCpi() != null && u.getCpi() >= minCpi))
//                .filter(u -> {
//                    if (companyName == null || companyName.isEmpty()) return true;
//                    return applicationRepo.findAll().stream()
//                            .anyMatch(app -> app.getStudent().getId().equals(u.getId()) &&
//                                    app.getNotification().getCompanyName().equalsIgnoreCase(companyName));
//                })
//                .collect(Collectors.toList());
//    }
//
//    public List<Application> getAllApplications() { return applicationRepo.findAll(); }
//}


package com.placement.management.service;

import com.placement.management.entity.*;
import com.placement.management.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationService {
    private final NotificationRepository notificationRepo;
    private final ApplicationRepository applicationRepo;
    private final UserRepository userRepo;
    private final StudentProfileRepository profileRepo;

    public NotificationService(NotificationRepository n, ApplicationRepository a, UserRepository u, StudentProfileRepository p) {
        this.notificationRepo = n; this.applicationRepo = a; this.userRepo = u; this.profileRepo = p;
    }

    public List<Notification> getNotificationsForStudent(Long studentId) {
        User student = userRepo.findById(studentId).orElseThrow();
        StudentProfile profile = profileRepo.findByUser(student).orElse(null);
        LocalDateTime sevenDaysAgo = LocalDateTime.now().minusDays(7);

        return notificationRepo.findAll().stream().filter(note -> {
            boolean isStarred = note.getStarredByStudentIds() != null && note.getStarredByStudentIds().contains(studentId);
            if (!isStarred && note.getCreatedAt() != null && note.getCreatedAt().isBefore(sevenDaysAgo)) return false;

            CareerPreference studentPref = (profile != null) ? profile.getCareerPreference() : null;
            // ELIGIBILITY LOGIC: Drive is BOTH or matches student preference
            boolean pathMatch = (note.getEligibilityType() == CareerPreference.BOTH) ||
                    (studentPref != null && note.getEligibilityType() == studentPref);

            if ("PUBLIC".equalsIgnoreCase(note.getMode())) return pathMatch;
            return note.getTargetStudentIds() != null && note.getTargetStudentIds().contains(studentId);
        }).collect(Collectors.toList());
    }

    @Transactional
    public String applyToJob(Long studentId, Long notificationId) {
        User student = userRepo.findById(studentId).orElseThrow();
        Notification note = notificationRepo.findById(notificationId).orElseThrow();
        StudentProfile profile = profileRepo.findByUser(student).orElse(null);

        if (profile == null) return "PROFILE_NOT_FOUND";

        // Use your Entity's specific field names: min10thPercent and min12thPercent
        if (student.getCpi() == null || profile.getTenthPercentage() == null || profile.getTwelfthPercentage() == null) {
            return "PROFILE_INCOMPLETE";
        }

        boolean pathMatch = note.getEligibilityType() == CareerPreference.BOTH ||
                note.getEligibilityType() == profile.getCareerPreference();
        if (!pathMatch) return "INELIGIBLE_PREFERENCE";

        if (student.getCpi() < note.getMinCpi()) return "INELIGIBLE_CPI";
        if (profile.getTenthPercentage() < (note.getMin10thPercent() != null ? note.getMin10thPercent() : 0)) return "INELIGIBLE_10TH";
        if (profile.getTwelfthPercentage() < (note.getMin12thPercent() != null ? note.getMin12thPercent() : 0)) return "INELIGIBLE_12TH";

        if (applicationRepo.findByStudentAndNotification(student, note).isPresent()) return "ALREADY_APPLIED";

        applicationRepo.save(new Application(student, note));
        return "SUCCESS";
    }

    public Notification createNotification(Notification note) { return notificationRepo.save(note); }

    @Transactional
    public void toggleStar(Long studentId, Long noteId) {
        Notification note = notificationRepo.findById(noteId).orElseThrow();
        if (note.getStarredByStudentIds().contains(studentId)) note.getStarredByStudentIds().remove(studentId);
        else note.getStarredByStudentIds().add(studentId);
        notificationRepo.save(note);
    }

    public List<User> getFilteredStudents(String company, Double minCpi, CareerPreference pref) {
        return userRepo.findAll().stream()
                .filter(u -> "STUDENT".equals(u.getRole()))
                .filter(u -> minCpi == null || (u.getCpi() != null && u.getCpi() >= minCpi))
                .filter(u -> {
                    if (pref == null || pref == CareerPreference.BOTH) return true;
                    StudentProfile profile = profileRepo.findByUser(u).orElse(null);
                    return profile != null && profile.getCareerPreference() == pref;
                })
                .collect(Collectors.toList());
    }
}