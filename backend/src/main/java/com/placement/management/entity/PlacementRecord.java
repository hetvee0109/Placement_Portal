package com.placement.management.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "placement_summary")
public class PlacementRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String studentName;
    private String studentEmail;
    private String companyName;
    private Double finalCtc;
    private LocalDate selectionDate;

    public PlacementRecord() {
        this.selectionDate = LocalDate.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }
    public String getStudentEmail() { return studentEmail; }
    public void setStudentEmail(String studentEmail) { this.studentEmail = studentEmail; }
    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }
    public Double getFinalCtc() { return finalCtc; }
    public void setFinalCtc(Double finalCtc) { this.finalCtc = finalCtc; }
    public LocalDate getSelectionDate() { return selectionDate; }
    public void setSelectionDate(LocalDate selectionDate) { this.selectionDate = selectionDate; }
}