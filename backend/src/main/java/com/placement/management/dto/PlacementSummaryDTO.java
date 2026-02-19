package com.placement.management.dto;

import java.time.LocalDateTime;

public class PlacementSummaryDTO {
    private Long id;
    private String studentName;
    private String companyName;
    private Double finalCtc;
    private LocalDateTime selectionDate;

    public PlacementSummaryDTO(Long id, String studentName, String companyName, Double finalCtc, LocalDateTime selectionDate) {
        this.id = id;
        this.studentName = studentName;
        this.companyName = companyName;
        this.finalCtc = finalCtc;
        this.selectionDate = selectionDate;
    }

    // Getters...
    public Long getId() { return id; }
    public String getStudentName() { return studentName; }
    public String getCompanyName() { return companyName; }
    public Double getFinalCtc() { return finalCtc; }
    public LocalDateTime getSelectionDate() { return selectionDate; }
}