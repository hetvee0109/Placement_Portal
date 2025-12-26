package com.placement.management.service;

import com.placement.management.entity.User;
import com.placement.management.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudentService {

    private final UserRepository repo;

    public StudentService(UserRepository repo) {
        this.repo = repo;
    }

    // Only TPO can view students
    public List<User> getAllStudents(String role) {

        if (!"TPO".equalsIgnoreCase(role))
            throw new RuntimeException("Access denied");

        return repo.findByRole("STUDENT");
    }

    // Only TPO can delete students
    public String deleteStudent(Long id, String role) {

        if (!"TPO".equalsIgnoreCase(role))
            return "Only TPO can delete students";

        if (!repo.existsById(id))
            return "Student not found";

        repo.deleteById(id);
        return "Student deleted successfully";
    }
}
