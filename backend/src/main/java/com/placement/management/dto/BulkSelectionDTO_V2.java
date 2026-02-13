package com.placement.management.dto;

import java.util.List;

public class BulkSelectionDTO_V2 {

    private Long jobId;
    private List<Long> selectedStudentIds;

    public Long getJobId() {
        return jobId;
    }

    public void setJobId(Long jobId) {
        this.jobId = jobId;
    }

    public List<Long> getSelectedStudentIds() {
        return selectedStudentIds;
    }

    public void setSelectedStudentIds(List<Long> selectedStudentIds) {
        this.selectedStudentIds = selectedStudentIds;
    }
}
