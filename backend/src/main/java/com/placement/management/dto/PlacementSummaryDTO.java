package com.placement.management.dto;

public class PlacementSummaryDTO {

    private Long id;
    private String studentName;
    private String companyName;
    private Double finalCtc;

    public PlacementSummaryDTO(Long id, String studentName, String companyName, Double finalCtc) {
        this.id = id;
        this.studentName = studentName;
        this.companyName = companyName;
        this.finalCtc = finalCtc;
    }

    public Long getId() { return id; }
    public String getStudentName() { return studentName; }
    public String getCompanyName() { return companyName; }
    public Double getFinalCtc() { return finalCtc; }
}
