package com.avsarverse.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OpportunityCostBreakdownDto {
    private Long opportunityId;
    private String title;
    private Double baseApplicationFee;
    private boolean waiverApplied;
    private Double waivedFee;
    private Double estimatedTravelCost;
    private Double netCost;
    private String waiverNote;
}
