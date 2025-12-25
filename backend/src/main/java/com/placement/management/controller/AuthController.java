package com.placement.management.controller;

import com.placement.management.entity.User;
import com.placement.management.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
// CORS is handled by WebConfig.java, so we don't strictly need @CrossOrigin here
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/signup")
    public String signup(@RequestBody User user) { // Added @RequestBody here
        return userService.registerUser(user);
    }

    @PostMapping("/signin")
    public String signin(@RequestBody Map<String, String> data) {
        return userService.loginLogic(data.get("email"), data.get("password"), data.get("role"));
    }

    @PostMapping("/forgot-password")
    public String forgot(@RequestBody Map<String, String> data) {
        return userService.updatePassword(data.get("email"), data.get("newPassword"));
    }
}