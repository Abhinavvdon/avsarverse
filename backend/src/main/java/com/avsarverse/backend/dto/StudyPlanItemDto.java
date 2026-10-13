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
public class StudyPlanItemDto {
    private String topic;
    private int hoursSuggested;
    private List<String> coveredOpportunities;
    private List<String> coreSubtopics;
    private String strategyTip;
}
