package com.placement.management.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "applications")
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    @JsonIgnoreProperties({"password", "role", "mobile", "applications", "cpi"})
    private User student;

    @ManyToOne
    @JoinColumn(name = "notification_id", nullable = false)
    @JsonIgnoreProperties({"targetStudentIds", "starredByStudentIds"})
    private Notification notification;

    private LocalDateTime appliedAt = LocalDateTime.now();

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ApplicationStatus status = ApplicationStatus.PENDING;

    @Column(name = "offer_letter_path")
    private String offerLetterPath;

    // ✅ UI Helper Fields: Not stored in DB, but sent to React
    @Transient
    private boolean selectedInOtherCompany;

    @Transient
    private String otherCompanyName;

    public Application() {}

    public Application(User student, Notification notification) {
        this.student = student;
        this.notification = notification;
        this.appliedAt = LocalDateTime.now();
    }

    // Standard Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getStudent() { return student; }
    public void setStudent(User student) { this.student = student; }
    public Notification getNotification() { return notification; }
    public void setNotification(Notification notification) { this.notification = notification; }
    public LocalDateTime getAppliedAt() { return appliedAt; }
    public void setAppliedAt(LocalDateTime appliedAt) { this.appliedAt = appliedAt; }
    public ApplicationStatus getStatus() { return status; }
    public void setStatus(ApplicationStatus status) { this.status = status; }
    public String getOfferLetterPath() { return offerLetterPath; }
    public void setOfferLetterPath(String offerLetterPath) { this.offerLetterPath = offerLetterPath; }

    // ✅ Getters/Setters for Transient Fields
    public boolean isSelectedInOtherCompany() { return selectedInOtherCompany; }
    public void setSelectedInOtherCompany(boolean selectedInOtherCompany) { this.selectedInOtherCompany = selectedInOtherCompany; }
    public String getOtherCompanyName() { return otherCompanyName; }
    public void setOtherCompanyName(String otherCompanyName) { this.otherCompanyName = otherCompanyName; }
}