package com.placement.management.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "notifications")
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String type; // "JOB_DRIVE" or "GENERAL_NOTICE"
    private String companyName;
    private Double minCpi;

    @Column(columnDefinition = "TEXT")
    private String description;

    private LocalDateTime driveDate;
    private String attachmentPath;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    private Double min10thPercent;
    private Double min12thPercent;

    @Enumerated(EnumType.STRING)
    private CareerPreference eligibilityType;

    private String mode; // "PUBLIC" or "PRIVATE"
    private String studentRole;

    // --- MAPPING TABLES (The ones currently missing) ---

    @ElementCollection
    @CollectionTable(
            name = "notification_target_student_ids",
            joinColumns = @JoinColumn(name = "notification_id")
    )
    @Column(name = "student_id")
    private List<Long> targetStudentIds = new ArrayList<>();

    @ElementCollection
    @CollectionTable(
            name = "notification_starred_by_student_ids",
            joinColumns = @JoinColumn(name = "notification_id")
    )
    @Column(name = "student_id")
    private List<Long> starredByStudentIds = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    // --- STANDARD GETTERS AND SETTERS ---

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }

    public Double getMinCpi() { return minCpi; }
    public void setMinCpi(Double minCpi) { this.minCpi = minCpi; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public LocalDateTime getDriveDate() { return driveDate; }
    public void setDriveDate(LocalDateTime driveDate) { this.driveDate = driveDate; }

    public String getAttachmentPath() { return attachmentPath; }
    public void setAttachmentPath(String attachmentPath) { this.attachmentPath = attachmentPath; }

    public LocalDateTime getCreatedAt() { return createdAt; }

    public Double getMin10thPercent() { return min10thPercent; }
    public void setMin10thPercent(Double min10thPercent) { this.min10thPercent = min10thPercent; }

    public Double getMin12thPercent() { return min12thPercent; }
    public void setMin12thPercent(Double min12thPercent) { this.min12thPercent = min12thPercent; }

    public CareerPreference getEligibilityType() { return eligibilityType; }
    public void setEligibilityType(CareerPreference eligibilityType) { this.eligibilityType = eligibilityType; }

    public String getMode() { return mode; }
    public void setMode(String mode) { this.mode = mode; }

    public String getStudentRole() { return studentRole; }
    public void setStudentRole(String studentRole) { this.studentRole = studentRole; }

    // FIXED: Both use List<Long> to match the field types exactly
    public List<Long> getTargetStudentIds() { return targetStudentIds; }
    public void setTargetStudentIds(List<Long> targetStudentIds) { this.targetStudentIds = targetStudentIds; }

    public List<Long> getStarredByStudentIds() { return starredByStudentIds; }
    public void setStarredByStudentIds(List<Long> starredByStudentIds) { this.starredByStudentIds = starredByStudentIds; }
}