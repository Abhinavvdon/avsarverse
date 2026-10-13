package com.avsarverse.backend.service;

import com.avsarverse.backend.dto.CostEstimateResponseDto;
import com.avsarverse.backend.dto.OpportunityCostBreakdownDto;
import com.avsarverse.backend.entity.Opportunity;
import com.avsarverse.backend.entity.StudentProfile;
import com.avsarverse.backend.repository.OpportunityRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class CostService {

    private final OpportunityRepository opportunityRepository;
    private final ProfileService profileService;

    public CostService(OpportunityRepository opportunityRepository, ProfileService profileService) {
        this.opportunityRepository = opportunityRepository;
        this.profileService = profileService;
    }

    public CostEstimateResponseDto estimateCosts(List<Long> opportunityIds) {
        StudentProfile student = profileService.getProfile();
        List<Opportunity> targets;
        if (opportunityIds != null && !opportunityIds.isEmpty()) {
            targets = opportunityRepository.findAllById(opportunityIds);
        } else if (student.getSavedOpportunityIds() != null && !student.getSavedOpportunityIds().isEmpty()) {
            targets = opportunityRepository.findAllById(student.getSavedOpportunityIds());
        } else {
            targets = opportunityRepository.findAll();
        }

        List<OpportunityCostBreakdownDto> breakdowns = new ArrayList<>();
        double totalBase = 0.0;
        double totalWaiverSavings = 0.0;
        double totalTravel = 0.0;
        double totalNet = 0.0;
        int waiverCount = 0;

        String studentCat = student.getCategory() != null ? student.getCategory().trim() : "General";

        for (Opportunity op : targets) {
            double baseFee = op.getApplicationFee() != null ? op.getApplicationFee() : 0.0;
            double travelCost = op.getEstimatedTravelCost() != null ? op.getEstimatedTravelCost() : 0.0;

            boolean waiverEligible = false;
            if (op.getFeeWaiverCategories() != null) {
                waiverEligible = op.getFeeWaiverCategories().stream()
                        .anyMatch(cat -> cat.equalsIgnoreCase(studentCat) || cat.equalsIgnoreCase("All"));
            }

            double waivedFee = waiverEligible ? 0.0 : baseFee;
            double saving = waiverEligible ? baseFee : 0.0;
            double netCost = waivedFee + travelCost;

            if (waiverEligible && baseFee > 0) {
                waiverCount++;
            }

            String waiverNote;
            if (baseFee == 0.0) {
                waiverNote = "Free application (No fee charged by organizing body)";
            } else if (waiverEligible) {
                waiverNote = String.format("100%% Fee Waiver applied for %s category (saved ₹%,.0f)", studentCat, baseFee);
            } else {
                waiverNote = String.format("Full application fee payable for %s category", studentCat);
            }

            breakdowns.add(OpportunityCostBreakdownDto.builder()
                    .opportunityId(op.getId())
                    .title(op.getTitle())
                    .baseApplicationFee(baseFee)
                    .waiverApplied(waiverEligible)
                    .waivedFee(waivedFee)
                    .estimatedTravelCost(travelCost)
                    .netCost(netCost)
                    .waiverNote(waiverNote)
                    .build());

            totalBase += baseFee;
            totalWaiverSavings += saving;
            totalTravel += travelCost;
            totalNet += netCost;
        }

        return CostEstimateResponseDto.builder()
                .breakdowns(breakdowns)
                .totalBaseFee(totalBase)
                .totalWaiverSavings(totalWaiverSavings)
                .totalTravelCost(totalTravel)
                .totalNetCost(totalNet)
                .qualifiedWaiverCount(waiverCount)
                .build();
    }
}
