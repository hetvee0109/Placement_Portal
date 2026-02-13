package com.placement.management.repository;

import com.placement.management.entity.OtpVerification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import java.util.Optional;

@Repository
public interface OtpRepository extends JpaRepository<OtpVerification, Long> {

    Optional<OtpVerification> findByEmail(String email);

    Optional<OtpVerification> findByEmailAndOtp(String email, String otp);

    @Transactional
    void deleteByEmail(String email);
}