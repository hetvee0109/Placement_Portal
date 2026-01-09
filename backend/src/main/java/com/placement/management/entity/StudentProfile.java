package com.placement.management.entity;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "student_profiles")
public class StudentProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // One-to-One mapping with User
    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    // =====================
    // Skills Section
    // =====================
    @ElementCollection
    @CollectionTable(
            name = "student_skills",
            joinColumns = @JoinColumn(name = "profile_id")
    )
    @Column(name = "skill")
    private List<String> skills;

    // =====================
    // Academic Details
    // =====================
    @Column(name = "tenth_percentage")
    private Double tenthPercentage;

    @Column(name = "twelfth_percentage")
    private Double twelfthPercentage;

    // =====================
    // Resume
    // =====================
    @Column(name = "resume_path")
    private String resumePath; // stores PDF file path or filename

    // =====================
    // Career Preference
    // =====================
    @Enumerated(EnumType.STRING)
    @Column(name = "career_preference")
    private CareerPreference careerPreference;


    // =====================
    // Constructors
    // =====================
    public StudentProfile() {}

    public StudentProfile(User user) {
        this.user = user;
    }

    // =====================
    // Getters and Setters
    // =====================
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public List<String> getSkills() {
        return skills;
    }

    public void setSkills(List<String> skills) {
        this.skills = skills;
    }

    public Double getTenthPercentage() {
        return tenthPercentage;
    }

    public void setTenthPercentage(Double tenthPercentage) {
        this.tenthPercentage = tenthPercentage;
    }

    public Double getTwelfthPercentage() {
        return twelfthPercentage;
    }

    public void setTwelfthPercentage(Double twelfthPercentage) {
        this.twelfthPercentage = twelfthPercentage;
    }

    public String getResumePath() {
        return resumePath;
    }

    public void setResumePath(String resumePath) {
        this.resumePath = resumePath;
    }

    public CareerPreference getCareerPreference() {
        return careerPreference;
    }

    public void setCareerPreference(CareerPreference careerPreference) {
        this.careerPreference = careerPreference;
    }

}

