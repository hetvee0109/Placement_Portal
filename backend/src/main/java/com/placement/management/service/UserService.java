package com.placement.management.service;

import com.placement.management.entity.User;
import com.placement.management.repository.UserRepository;
import com.placement.management.repository.StudentProfileRepository; // Import added
import com.placement.management.repository.ApplicationRepository;    // Import added
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class UserService {

    private final UserRepository repo;
    private final StudentProfileRepository profileRepo; // Added
    private final ApplicationRepository appRepo;       // Added

    // Constructor injection for all required repositories
    public UserService(UserRepository repo, StudentProfileRepository profileRepo, ApplicationRepository appRepo) {
        this.repo = repo;
        this.profileRepo = profileRepo;
        this.appRepo = appRepo;
    }

    // ================= SIGN UP =================
    public String registerUser(User user) {
        if (user.getName() == null || user.getName().trim().isEmpty())
            return "Name is required";
        if (user.getEmail() == null || user.getEmail().trim().isEmpty())
            return "Email is required";
        if (user.getPassword() == null || user.getPassword().trim().isEmpty())
            return "Password is required";
        if (user.getRole() == null || user.getRole().trim().isEmpty())
            return "Role is required";
        if (repo.existsByEmail(user.getEmail()))
            return "Email already registered";

        repo.save(user);
        return "Signup successful";
    }

    public Map<String, Object> loginLogic(String email, String password, String role) {
        Map<String, Object> response = new HashMap<>();
        User user = repo.findByEmail(email).orElse(null);

        if (user != null && user.getPassword().equals(password) && user.getRole().equalsIgnoreCase(role)) {
            response.put("status", "success");
            response.put("id", user.getId());
            response.put("name", user.getName());
            response.put("role", user.getRole());
            response.put("email", user.getEmail());
        } else {
            response.put("status", "error");
            response.put("message", "Invalid email, password, or role");
        }
        return response;
    }

    // ================= FORGOT PASSWORD =================
    public String updatePassword(String email, String newPassword) {
        if (email == null || email.trim().isEmpty()) return "Email is required";
        if (newPassword == null || newPassword.trim().isEmpty()) return "New password is required";

        User user = repo.findByEmail(email).orElse(null);
        if (user == null) return "Email not registered";

        user.setPassword(newPassword);
        repo.save(user);
        return "Password updated successfully";
    }

    // ================= GET USER BY EMAIL =================
    public User getUserByEmail(String email) {
        return repo.findByEmail(email).orElse(null);
    }

    // ================= GET ALL STUDENTS =================
    public List<User> getAllUsersByRole(String role) {
        return repo.findByRole(role);
    }

    // ================= DELETE STUDENT BY ID =================
    @Transactional
    public void deleteUserById(Long userId) {
        // 1. Check if user exists first to avoid unnecessary work
        if (!repo.existsById(userId)) {
            return;
        }

        // 2. Delete associated data in the correct order to respect constraints
        // Note: Make sure these methods (deleteByUserId/deleteByStudentId)
        // are defined in your respective repositories.
        profileRepo.deleteByUserId(userId);
        appRepo.deleteByStudentId(userId);

        // 3. Finally delete the user from the users table
        repo.deleteById(userId);
    }
}