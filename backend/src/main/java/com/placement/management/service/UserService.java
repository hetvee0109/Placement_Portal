package com.placement.management.service;

import com.placement.management.entity.User;
import com.placement.management.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public String registerUser(User user) {
        if (user.getEmail() == null || !user.getEmail().toLowerCase().endsWith("@ddu.ac.in")) {
            return "Error: Use official @ddu.ac.in email only!";
        }

        if (user.getRole().equals("STUDENT") && !user.getEmail().contains(".stu@")) {
            return "Error: Students must use name.stu@ddu.ac.in";
        }

        if (user.getRole().equals("TPO") && !user.getEmail().contains(".tpo@")) {
            return "Error: TPOs must use name.tpo@ddu.ac.in";
        }

        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return "Error: Email already registered!";
        }

        userRepository.save(user);
        return "SUCCESS";
    }

    public String loginLogic(String email, String password, String role) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (user.getPassword().equals(password) && user.getRole().equals(role)) {
                return "SUCCESS";
            }
        }
        return "Invalid Credentials or Role!";
    }

    public String updatePassword(String email, String newPassword) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setPassword(newPassword);
            userRepository.save(user);
            return "SUCCESS";
        }
        return "Error: User not found!";
    }
}