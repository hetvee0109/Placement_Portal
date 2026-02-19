package com.placement.management.service;

import com.placement.management.dto.PlacementSummaryDTO;
import com.placement.management.entity.PlacementRecord;
import com.placement.management.repository.PlacementSummaryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PlacementService {

    @Autowired
    private PlacementSummaryRepository placementRepository;

    public List<PlacementSummaryDTO> getPlacementSummary() {
        List<PlacementRecord> placements = placementRepository.findAll();

        return placements.stream().map(p -> new PlacementSummaryDTO(
                p.getId(),
                p.getStudent().getName(),
                p.getNotification().getCompanyName(), // ✅ Use getNotification() instead of getJob()
                p.getFinalCtc(),
                p.getSelectionDate() // ✅ Use getSelectionDate() instead of getCreatedAt()
        )).collect(Collectors.toList());
    }
}