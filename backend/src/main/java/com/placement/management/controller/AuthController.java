package com.placement.management.controller;

import com.placement.management.entity.User;
import com.placement.management.service.UserService;
import com.placement.management.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
// CORS is handled by WebConfig.java
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    // SIGNUP
    @PostMapping("/signup")
    public String signup(@RequestBody User user) {
        return userService.registerUser(user);
    }

    // SIGNIN
    @PostMapping("/signin")
    public String signin(@RequestBody Map<String, String> data) {
        return userService.loginLogic(data.get("email"), data.get("password"), data.get("role"));
    }

    // FORGOT PASSWORD
    @PostMapping("/forgot-password")
    public String forgot(@RequestBody Map<String, String> data) {
        return userService.updatePassword(data.get("email"), data.get("newPassword"));
    }

    // GET USER PROFILE BY EMAIL
    @GetMapping("/get-user")
    public User getUser(@RequestParam String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        return userOpt.orElse(null);
    }
}
