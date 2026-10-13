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
public class CostEstimateResponseDto {
    private List<OpportunityCostBreakdownDto> breakdowns;
    private Double totalBaseFee;
    private Double totalWaiverSavings;
    private Double totalTravelCost;
    private Double totalNetCost;
    private int qualifiedWaiverCount;
}
