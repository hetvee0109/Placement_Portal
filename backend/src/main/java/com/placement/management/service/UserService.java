//package com.placement.management.service;
//
//import com.placement.management.entity.User;
//import com.placement.management.repository.UserRepository;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//import java.util.Optional;
//
//@Service
//public class UserService {
//
//    @Autowired
//    private UserRepository userRepository;
//
//    public String registerUser(User user) {
//        if (user.getEmail() == null || !user.getEmail().toLowerCase().endsWith("@ddu.ac.in")) {
//            return "Error: Use official @ddu.ac.in email only!";
//        }
//
//        if (user.getRole().equals("STUDENT") && !user.getEmail().contains(".stu@")) {
//            return "Error: Students must use name.stu@ddu.ac.in";
//        }
//
//        if (user.getRole().equals("TPO") && !user.getEmail().contains(".tpo@")) {
//            return "Error: TPOs must use name.tpo@ddu.ac.in";
//        }
//
//        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
//            return "Error: Email already registered!";
//        }
//
//        userRepository.save(user);
//        return "SUCCESS";
//    }
//
//    public String loginLogic(String email, String password, String role) {
//        Optional<User> userOpt = userRepository.findByEmail(email);
//        if (userOpt.isPresent()) {
//            User user = userOpt.get();
//            if (user.getPassword().equals(password) && user.getRole().equals(role)) {
//                return "SUCCESS";
//            }
//        }
//        return "Invalid Credentials or Role!";
//    }
//
//    public String updatePassword(String email, String newPassword) {
//        Optional<User> userOpt = userRepository.findByEmail(email);
//        if (userOpt.isPresent()) {
//            User user = userOpt.get();
//            user.setPassword(newPassword);
//            userRepository.save(user);
//            return "SUCCESS";
//        }
//        return "Error: User not found!";
//    }
//}

package com.placement.management.service;

import com.placement.management.entity.User;
import com.placement.management.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository repo;

    public UserService(UserRepository repo) {
        this.repo = repo;
    }

    // ================= SIGN UP =================
    public String registerUser(User user) {

        // Empty field validation
        if (user.getName() == null || user.getName().trim().isEmpty())
            return "Name is required";

        if (user.getEmail() == null || user.getEmail().trim().isEmpty())
            return "Email is required";

        if (user.getPassword() == null || user.getPassword().trim().isEmpty())
            return "Password is required";

        if (user.getRole() == null || user.getRole().trim().isEmpty())
            return "Role is required";

        // Duplicate email check
        if (repo.existsByEmail(user.getEmail()))
            return "Email already registered";

        // Save (password stored as-is because we cannot add dependency)
        repo.save(user);

        return "Signup successful";
    }

    // ================= SIGN IN =================
    public String loginLogic(String email, String password, String role) {

        if (email == null || password == null || role == null)
            return "All fields are required";

        User user = repo.findByEmail(email)
                .orElse(null);

        if (user == null)
            return "Invalid email";

        if (!user.getPassword().equals(password))
            return "Invalid password";

        if (!user.getRole().equalsIgnoreCase(role))
            return "Invalid role";

        return "Login successful";
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
}
