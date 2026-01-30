//package com.placement.management.entity;
//
//import jakarta.persistence.*;
//import java.time.LocalDateTime;
//import java.util.List;
//import java.util.Set;
//import java.util.HashSet;
//
//@Entity
//@Table(name = "notifications")
//public class Notification {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
//    private String type; // "JOB_DRIVE" or "GENERAL_NOTICE"
//    private String companyName; // Optional for General Notice
//    private Double minCpi;
//    private String description;
//    private LocalDateTime driveDate;
//    private String attachmentPath; // For PDF notices
//    private Double min10thPercent; // New
//    private Double min12thPercent; // New
//
//    @Enumerated(EnumType.STRING)
//    private CareerPreference eligibilityType;
//
//    private String mode; // "PUBLIC" or "PRIVATE"
//
//    @ElementCollection
//    private List<Long> targetStudentIds;
//
//    // Track which students have "Starred" this notification
//    @ElementCollection
//    private Set<Long> starredByStudentIds = new HashSet<>();
//
//    private LocalDateTime createdAt = LocalDateTime.now();
//
//    // Getters and Setters
//    public Long getId() { return id; }
//    public String getType() { return type; }
//    public void setType(String type) { this.type = type; }
//    public String getCompanyName() { return companyName; }
//    public void setCompanyName(String companyName) { this.companyName = companyName; }
//    public Double getMinCpi() { return minCpi; }
//    public void setMinCpi(Double minCpi) { this.minCpi = minCpi; }
//    public String getDescription() { return description; }
//    public void setDescription(String description) { this.description = description; }
//    public LocalDateTime getDriveDate() { return driveDate; }
//    public void setDriveDate(LocalDateTime driveDate) { this.driveDate = driveDate; }
//    public String getAttachmentPath() { return attachmentPath; }
//    public void setAttachmentPath(String attachmentPath) { this.attachmentPath = attachmentPath; }
//    public CareerPreference getEligibilityType() { return eligibilityType; }
//    public void setEligibilityType(CareerPreference eligibilityType) { this.eligibilityType = eligibilityType; }
//    public String getMode() { return mode; }
//    public void setMode(String mode) { this.mode = mode; }
//    public List<Long> getTargetStudentIds() { return targetStudentIds; }
//    public void setTargetStudentIds(List<Long> targetStudentIds) { this.targetStudentIds = targetStudentIds; }
//    public Set<Long> getStarredByStudentIds() { return starredByStudentIds; }
//    public void setStarredByStudentIds(Set<Long> starredByStudentIds) { this.starredByStudentIds = starredByStudentIds; }
//    public LocalDateTime getCreatedAt() { return createdAt; }
//    public Double getMin10thPercent() { return min10thPercent; }
//    public void setMin10thPercent(Double p) { this.min10thPercent = p; }
//    public Double getMin12thPercent() { return min12thPercent; }
//    public void setMin12thPercent(Double p) { this.min12thPercent = p; }
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
    private String companyName;
    private Double minCpi;
    private String description;
    private LocalDateTime driveDate;
    private String attachmentPath;
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    // Percentages
    private Double min10thPercent;
    private Double min12thPercent;

    @Enumerated(EnumType.STRING) // MUST HAVE THIS
    private CareerPreference eligibilityType;

    private String mode; // "PUBLIC" or "PRIVATE"

    // Inside Notification.java
    private String studentRole; // Ensure this field exists



    @ElementCollection
    private List<Long> targetStudentIds;

    @ElementCollection
    private Set<Long> starredByStudentIds = new HashSet<>();

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    // Standard Getters and Setters
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
    public Double getMin10thPercent() { return min10thPercent; }
    public void setMin10thPercent(Double p) { this.min10thPercent = p; }
    public Double getMin12thPercent() { return min12thPercent; }
    public void setMin12thPercent(Double p) { this.min12thPercent = p; }

    public String getStudentRole() {return studentRole;}
    public void setStudentRole(String studentRole) {this.studentRole = studentRole;}
}