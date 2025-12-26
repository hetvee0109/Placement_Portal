package com.placement.management.service;

import com.placement.management.entity.User;
import com.placement.management.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class UserService {

    private final UserRepository repo;

    public UserService(UserRepository repo) {
        this.repo = repo;
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

    // ================= SIGN IN =================
    public Map<String, String> loginLogic(String email, String password, String role) {

        Map<String, String> response = new HashMap<>();

        if (email == null || password == null || role == null) {
            response.put("status", "error");
            response.put("message", "All fields are required");
            return response;
        }

        User user = repo.findByEmail(email).orElse(null);

        if (user == null) {
            response.put("status", "error");
            response.put("message", "Invalid email");
            return response;
        }

        if (!user.getPassword().equals(password)) {
            response.put("status", "error");
            response.put("message", "Invalid password");
            return response;
        }

        if (!user.getRole().equalsIgnoreCase(role)) {
            response.put("status", "error");
            response.put("message", "Invalid role");
            return response;
        }

        // ✅ SUCCESS
        response.put("status", "success");
        response.put("email", user.getEmail());
        response.put("role", user.getRole());

        return response;
    }

    // ================= FORGOT PASSWORD =================
    public String updatePassword(String email, String newPassword) {

        if (email == null || email.trim().isEmpty())
            return "Email is required";

        if (newPassword == null || newPassword.trim().isEmpty())
            return "New password is required";

        User user = repo.findByEmail(email).orElse(null);

        if (user == null)
            return "Email not registered";

        user.setPassword(newPassword);
        repo.save(user);

        return "Password updated successfully";
    }

    public User getUserByEmail(String email) {
        return repo.findByEmail(email).orElse(null);
    }
}
