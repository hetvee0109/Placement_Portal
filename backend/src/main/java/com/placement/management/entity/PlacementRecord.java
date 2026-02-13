package com.placement.management.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "placements",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"student_id", "notification_id"})
        }
)
public class PlacementRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // selected student
    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    // job/notification
    @ManyToOne
    @JoinColumn(name = "notification_id", nullable = false)
    private Notification notification;

    @Column(nullable = false)
    private Double finalCtc;

    private LocalDateTime selectionDate = LocalDateTime.now();

    public PlacementRecord() {}

    public PlacementRecord(User student, Notification notification, Double finalCtc) {
        this.student = student;
        this.notification = notification;
        this.finalCtc = finalCtc;
        this.selectionDate = LocalDateTime.now();
    }

    public Long getId() { return id; }

    public User getStudent() { return student; }
    public void setStudent(User student) { this.student = student; }

    public Notification getNotification() { return notification; }
    public void setNotification(Notification notification) { this.notification = notification; }

    public Double getFinalCtc() { return finalCtc; }
    public void setFinalCtc(Double finalCtc) { this.finalCtc = finalCtc; }

    public LocalDateTime getSelectionDate() { return selectionDate; }
    public void setSelectionDate(LocalDateTime selectionDate) { this.selectionDate = selectionDate; }
}
