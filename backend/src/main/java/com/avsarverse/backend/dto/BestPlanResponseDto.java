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
public class BestPlanResponseDto {
    private List<Opportunity> chosenOpportunities;
    private List<RejectedOpportunityDto> rejectedOpportunities;
    private List<StudyPlanItemDto> combinedStudyPlan;
    private int totalPreparationTopics;
    private int estimatedTotalHours;
    private int totalOpportunitiesEvaluated;
    private int chosenCount;
    private double compositeScore;
    private String executiveSummary;
}
