package com.placement.management.controller;

import com.placement.management.entity.User;
import com.placement.management.service.StudentService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    private final StudentService service;

    public StudentController(StudentService service) {
        this.service = service;
    }

    // View all students (TPO only)
    @GetMapping
    public List<User> getStudents(@RequestParam String role) {
        return service.getAllStudents(role);
    }

    // Delete student (TPO only)
    @DeleteMapping("/{id}")
    public String deleteStudent(
            @PathVariable Long id,
            @RequestParam String role) {

        return service.deleteStudent(id, role);
    }
}
