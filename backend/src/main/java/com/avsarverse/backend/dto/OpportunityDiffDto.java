package com.avsarverse.backend.dto;

import com.avsarverse.backend.entity.OpportunityType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OpportunityDiffDto {
    private Long opportunityId;
    private String title;
    private OpportunityType type;
    private boolean previouslyEligible;
    private boolean currentlyEligible;
    private String changeType; // "UNLOCKED", "LOST", "UNCHANGED"
    private String reason;
}
