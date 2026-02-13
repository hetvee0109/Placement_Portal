package com.placement.management.controller;

import com.placement.management.entity.User;
import com.placement.management.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<?> signin(@RequestBody Map<String, String> data) {
        // We change this to a Map<String, Object> to handle the Long ID
        Map<String, Object> response = userService.loginLogic(
                data.get("email"),
                data.get("password"),
                data.get("role")
        );

        if (response.get("status").equals("success")) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(401).body(response);
        }
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
    public ResponseEntity<String> deleteStudent(@PathVariable Long id) {
        try {
            userService.deleteUserById(id);
            return ResponseEntity.ok("Student and all associated records deleted successfully");
        } catch (Exception e) {
            // This handles cases where deletion might still fail due to unforeseen constraints
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error deleting student: " + e.getMessage());
        }
    }
}
