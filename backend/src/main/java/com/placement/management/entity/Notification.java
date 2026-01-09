//package com.placement.management.entity;
//
//import jakarta.persistence.*;
//import java.time.LocalDateTime;
//
//@Entity
//@Table(name = "notifications")
//public class Notification {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
//    private String companyName;
//    private Double minCpi;
//    private String description;
//    private LocalDateTime driveDate;
//
//    @Enumerated(EnumType.STRING)
//    private CareerPreference eligibilityType; // PLACEMENT or HIGHER_STUDIES
//
//    private String mode; // "PUBLIC" or "PRIVATE"
//
//    // For Private mode: specific target student IDs
//    @ElementCollection
//    private java.util.List<Long> targetStudentIds;
//
//    private LocalDateTime createdAt = LocalDateTime.now();
//
//    // Getters and Setters
//    public Long getId() { return id; }
//    public String getCompanyName() { return companyName; }
//    public void setCompanyName(String companyName) { this.companyName = companyName; }
//    public Double getMinCpi() { return minCpi; }
//    public void setMinCpi(Double minCpi) { this.minCpi = minCpi; }
//    public String getDescription() { return description; }
//    public void setDescription(String description) { this.description = description; }
//    public LocalDateTime getDriveDate() { return driveDate; }
//    public void setDriveDate(LocalDateTime driveDate) { this.driveDate = driveDate; }
//    public CareerPreference getEligibilityType() { return eligibilityType; }
//    public void setEligibilityType(CareerPreference eligibilityType) { this.eligibilityType = eligibilityType; }
//    public String getMode() { return mode; }
//    public void setMode(String mode) { this.mode = mode; }
//    public java.util.List<Long> getTargetStudentIds() { return targetStudentIds; }
//    public void setTargetStudentIds(java.util.List<Long> targetStudentIds) { this.targetStudentIds = targetStudentIds; }
//}


package com.placement.management.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.HashSet;

@Entity
@Table(name = "notifications")
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String type; // "JOB_DRIVE" or "GENERAL_NOTICE"
    private String companyName; // Optional for General Notice
    private Double minCpi;
    private String description;
    private LocalDateTime driveDate;
    private String attachmentPath; // For PDF notices

    @Enumerated(EnumType.STRING)
    private CareerPreference eligibilityType;

    private String mode; // "PUBLIC" or "PRIVATE"

    @ElementCollection
    private List<Long> targetStudentIds;

    // Track which students have "Starred" this notification
    @ElementCollection
    private Set<Long> starredByStudentIds = new HashSet<>();

    private LocalDateTime createdAt = LocalDateTime.now();

    // Getters and Setters
    public Long getId() { return id; }
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
    public CareerPreference getEligibilityType() { return eligibilityType; }
    public void setEligibilityType(CareerPreference eligibilityType) { this.eligibilityType = eligibilityType; }
    public String getMode() { return mode; }
    public void setMode(String mode) { this.mode = mode; }
    public List<Long> getTargetStudentIds() { return targetStudentIds; }
    public void setTargetStudentIds(List<Long> targetStudentIds) { this.targetStudentIds = targetStudentIds; }
    public Set<Long> getStarredByStudentIds() { return starredByStudentIds; }
    public void setStarredByStudentIds(Set<Long> starredByStudentIds) { this.starredByStudentIds = starredByStudentIds; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}