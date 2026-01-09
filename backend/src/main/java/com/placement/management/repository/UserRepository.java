package com.placement.management.repository;

import com.placement.management.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    List<User> findByRole(String role);

    @Query("SELECT DISTINCT u FROM User u, Application app " +
            "WHERE u.id = app.student.id " +
            "AND u.role = 'STUDENT' " +
            "AND (:minCpi IS NULL OR u.cpi >= :minCpi) " +
            "AND (:companyName IS NULL OR :companyName = '' OR " +
            "     app.notification.companyName LIKE %:companyName%)")
    List<User> filterStudentsForNotification(@Param("companyName") String companyName,
                                             @Param("minCpi") Double minCpi);
}
