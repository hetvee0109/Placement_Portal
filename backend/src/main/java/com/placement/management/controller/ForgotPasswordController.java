package com.placement.management.controller;

import com.placement.management.entity.OtpVerification;
import com.placement.management.entity.User;
import com.placement.management.repository.OtpRepository;
import com.placement.management.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.web.bind.annotation.*;
import org.springframework.mail.javamail.JavaMailSender;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;
import java.util.Random;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class ForgotPasswordController {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private OtpRepository otpRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/send-otp")
    public ResponseEntity<?> sendOtp(@RequestBody Map<String, String> request) {
        String email = request.get("email");

        Optional<User> user = userRepository.findByEmail(email);
        if (user.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Email ID not registered");
        }

        // Generate 4-digit OTP
        String otp = String.format("%04d", new Random().nextInt(10000));

        // Save/Update OTP in DB
        otpRepository.deleteByEmail(email);
        OtpVerification otpVerification = new OtpVerification();
        otpVerification.setEmail(email);
        otpVerification.setOtp(otp);
        otpVerification.setExpiryTime(LocalDateTime.now().plusMinutes(5));
        otpRepository.save(otpVerification);

        // Send Email
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(email);
            message.setSubject("Password Reset OTP");
            message.setText("Your verification code is: " + otp + ". It is valid for 5 minutes.");
            mailSender.send(message);
            return ResponseEntity.ok("OTP sent successfully");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to send email");
        }
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String otp = request.get("otp");

        Optional<OtpVerification> otpDetails = otpRepository.findByEmailAndOtp(email, otp);

        if (otpDetails.isPresent() && otpDetails.get().getExpiryTime().isAfter(LocalDateTime.now())) {
            return ResponseEntity.ok("OTP Verified");
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid or expired OTP");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String newPassword = request.get("password");

        return userRepository.findByEmail(email).map(user -> {
            user.setPassword(newPassword); // Note: Should ideally use PasswordEncoder
            userRepository.save(user);
            otpRepository.deleteByEmail(email); // Clean up
            return ResponseEntity.ok("Password updated successfully");
        }).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found"));
    }
}