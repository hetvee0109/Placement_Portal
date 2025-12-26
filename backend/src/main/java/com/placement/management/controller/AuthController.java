package com.placement.management.controller;

import com.placement.management.entity.User;
import com.placement.management.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;

    // Constructor Injection (Best Practice)
    public AuthController(UserService userService) {
        this.userService = userService;
    }

    // ================= SIGN UP =================
    @PostMapping("/signup")
    public String signup(@RequestBody User user) {
        return userService.registerUser(user);
    }

    // ================= SIGN IN =================
    @PostMapping("/signin")
    public Map<String, String> signin(@RequestBody Map<String, String> data) {
        return userService.loginLogic(
                data.get("email"),
                data.get("password"),
                data.get("role")
        );
    }

    // ================= FORGOT PASSWORD =================
    @PostMapping("/forgot-password")
    public String forgotPassword(@RequestBody Map<String, String> data) {
        return userService.updatePassword(
                data.get("email"),
                data.get("newPassword")
        );
    }

    @GetMapping("/get-user")
    public User getUser(@RequestParam String email) {
        return userService.getUserByEmail(email);
    }
}
