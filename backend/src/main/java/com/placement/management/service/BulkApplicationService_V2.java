package com.placement.management.service;

import com.placement.management.dto.BulkSelectionDTO_V2;
import com.placement.management.repository.ApplicationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class BulkApplicationService_V2 {

    private final ApplicationRepository appRepo;

    public BulkApplicationService_V2(ApplicationRepository appRepo) {
        this.appRepo = appRepo;
    }

    @Transactional
    public void updateStudentStatuses(BulkSelectionDTO_V2 dto) {

        Long jobId = dto.getJobId();
        List<Long> selectedStudentIds = dto.getSelectedStudentIds();

        // 1) Reject everyone first
        appRepo.markAllAsRejected(jobId);

        // 2) Select only selected students (if list is not empty)
        if (selectedStudentIds != null && !selectedStudentIds.isEmpty()) {
            appRepo.markSelectedStudents(jobId, selectedStudentIds);
        }
    }
}
