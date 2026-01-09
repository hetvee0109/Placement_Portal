//package com.placement.management.entity;
//
//import jakarta.persistence.*;
//import java.time.LocalDateTime;
//
//@Entity
//@Table(name = "applications")
//public class Application {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
//    @ManyToOne
//    @JoinColumn(name = "student_id", nullable = false)
//    private User student;
//
//    @ManyToOne
//    @JoinColumn(name = "notification_id", nullable = false)
//    private Notification notification;
//
//    private LocalDateTime appliedAt = LocalDateTime.now();
//
//    public Application() {}
//
//    public Application(User student, Notification notification) {
//        this.student = student;
//        this.notification = notification;
//        this.appliedAt = LocalDateTime.now();
//    }
//
//    // Full Getters and Setters
//    public Long getId() { return id; }
//    public void setId(Long id) { this.id = id; }
//
//    public User getStudent() { return student; }
//    public void setStudent(User student) { this.student = student; }
//
//    public Notification getNotification() { return notification; }
//    public void setNotification(Notification notification) { this.notification = notification; }
//
//    public LocalDateTime getAppliedAt() { return appliedAt; }
//    public void setAppliedAt(LocalDateTime appliedAt) { this.appliedAt = appliedAt; }
//}


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
    // This prevents the "Infinite Loop" error by ignoring unnecessary fields during JSON conversion
    @JsonIgnoreProperties({"password", "role", "mobile", "cpi", "applications"})
    private User student;

    @ManyToOne
    @JoinColumn(name = "notification_id", nullable = false)
    // This prevents loading huge lists of IDs when just viewing an application
    @JsonIgnoreProperties({"targetStudentIds", "starredByStudentIds"})
    private Notification notification;

    private LocalDateTime appliedAt = LocalDateTime.now();

    public Application() {}

    public Application(User student, Notification notification) {
        this.student = student;
        this.notification = notification;
        this.appliedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getStudent() { return student; }
    public void setStudent(User student) { this.student = student; }

    public Notification getNotification() { return notification; }
    public void setNotification(Notification notification) { this.notification = notification; }

    public LocalDateTime getAppliedAt() { return appliedAt; }
    public void setAppliedAt(LocalDateTime appliedAt) { this.appliedAt = appliedAt; }
}