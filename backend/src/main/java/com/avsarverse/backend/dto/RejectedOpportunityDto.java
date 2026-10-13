package com.avsarverse.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RejectedOpportunityDto {
    private Long opportunityId;
    private String title;
    private String reason;
    private String rejectionType; // "DATE_CLASH", "EXCLUSION_CONFLICT", "LOW_MATCH_SCORE", "CAPACITY_LIMIT"
}
