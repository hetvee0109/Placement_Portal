package com.placement.management.dto;

import java.util.List;

public class StudentDashboardDTO {
    private String name;
    private Double tenthPercentage;
    private long appliedCount;
    private long pendingCount;
    private long offersCount;
    private List<AppDetail> applications; // 1. Renamed to match the inner class below

    // Inner class for the table data
    public static class AppDetail { // 2. Changed name to AppDetail to match your Service call
        private String companyName;
        private String status;
        private String date; // 3. Changed to String to match your .toString() service call

        // 4. Fixed Constructor Syntax (Removed 'static class' from constructor)
        public AppDetail(String companyName, String status, String date) {
            this.companyName = companyName;
            this.status = status;
            this.date = date;
        }

        // Getters
        public String getCompanyName() { return companyName; }
        public String getStatus() { return status; }
        public String getDate() { return date; }
    }

    // Getters and Setters for StudentDashboardDTO
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public Double getTenthPercentage() { return tenthPercentage; }
    public void setTenthPercentage(Double tenthPercentage) { this.tenthPercentage = tenthPercentage; }
    public long getAppliedCount() { return appliedCount; }
    public void setAppliedCount(long appliedCount) { this.appliedCount = appliedCount; }
    public long getPendingCount() { return pendingCount; }
    public void setPendingCount(long pendingCount) { this.pendingCount = pendingCount; }
    public long getOffersCount() { return offersCount; }
    public void setOffersCount(long offersCount) { this.offersCount = offersCount; }

    // 5. Updated to use AppDetail
    public List<AppDetail> getApplications() { return applications; }
    public void setApplications(List<AppDetail> applications) { this.applications = applications; }
}