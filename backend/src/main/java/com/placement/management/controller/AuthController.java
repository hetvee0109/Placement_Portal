package com.placement.management.controller;

import com.placement.management.entity.User;
import com.placement.management.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000") // allow React frontend
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/signup")
    public String signup(@RequestBody User user) {
        return userService.registerUser(user);
    }

    @PostMapping("/signin")
    public Map<String, String> signin(@RequestBody Map<String, String> data) {
        return userService.loginLogic(data.get("email"), data.get("password"), data.get("role"));
    }

    @PostMapping("/forgot-password")
    public String forgotPassword(@RequestBody Map<String, String> data) {
        return userService.updatePassword(data.get("email"), data.get("newPassword"));
    }

    @GetMapping("/get-user")
    public User getUser(@RequestParam String email) {
        return userService.getUserByEmail(email);
    }

    @GetMapping("/students")
    public List<User> getStudents() {
        return userService.getAllUsersByRole("STUDENT");
    }

    @DeleteMapping("/students/{id}")
    public String deleteStudent(@PathVariable Long id) {
        return userService.deleteUserById(id);
    }
}
