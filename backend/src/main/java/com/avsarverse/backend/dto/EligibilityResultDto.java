package com.avsarverse.backend.dto;

import com.avsarverse.backend.entity.Opportunity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EligibilityResultDto {
    private Long opportunityId;
    private Opportunity opportunity;
    private boolean eligible;
    private int matchScore; // 0-100
    private String status; // "ELIGIBLE", "ALMOST_ELIGIBLE", "NOT_ELIGIBLE"
    private List<CriterionResultDto> criteria;
    private String primaryGap;
}
