package com.placement.management.repository;

import com.placement.management.entity.StudentProfile;
import com.placement.management.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StudentProfileRepository extends JpaRepository<StudentProfile, Long> {

    Optional<StudentProfile> findByUser(User user);
    void deleteByUserId(Long userId);
    boolean existsByUser(User user);
}
