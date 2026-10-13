package com.avsarverse.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CriterionResultDto {
    private String label;
    private boolean passed;
    private String studentValue;
    private String requiredValue;
    private String gapExplanation;
}
