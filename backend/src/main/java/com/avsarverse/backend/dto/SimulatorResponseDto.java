package com.avsarverse.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SimulatorResponseDto {
    private List<EligibilityResultDto> currentResults;
    private List<EligibilityResultDto> simulatedResults;
    private List<OpportunityDiffDto> diffs;
    private int unlockedCount;
    private int lostCount;
    private int totalSimulatedEligible;
    private int totalCurrentEligible;
    private String summaryMessage;
}
