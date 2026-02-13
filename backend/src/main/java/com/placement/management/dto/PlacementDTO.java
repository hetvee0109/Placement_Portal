package com.placement.management.dto;

public class PlacementDTO {

    private Long jobId;
    private Long studentId;
    private Double finalCtc;

    public Long getJobId() { return jobId; }
    public void setJobId(Long jobId) { this.jobId = jobId; }

    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }

    public Double getFinalCtc() { return finalCtc; }
    public void setFinalCtc(Double finalCtc) { this.finalCtc = finalCtc; }
}
