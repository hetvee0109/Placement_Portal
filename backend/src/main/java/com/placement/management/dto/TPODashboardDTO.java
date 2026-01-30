package com.placement.management.dto;
import java.util.List;
import java.util.Map;

public class TPODashboardDTO {
    private long totalStudents;
    private long placedCount;
    private long unplacedCount;
    private long totalCompanies;
    private List<Map<String, Object>> chartData; // For Recharts

    // Getters and Setters
    public long getTotalStudents() { return totalStudents; }
    public void setTotalStudents(long totalStudents) { this.totalStudents = totalStudents; }
    public long getPlacedCount() { return placedCount; }
    public void setPlacedCount(long placedCount) { this.placedCount = placedCount; }
    public long getUnplacedCount() { return unplacedCount; }
    public void setUnplacedCount(long unplacedCount) { this.unplacedCount = unplacedCount; }
    public long getTotalCompanies() { return totalCompanies; }
    public void setTotalCompanies(long totalCompanies) { this.totalCompanies = totalCompanies; }
    public List<Map<String, Object>> getChartData() { return chartData; }
    public void setChartData(List<Map<String, Object>> chartData) { this.chartData = chartData; }
}