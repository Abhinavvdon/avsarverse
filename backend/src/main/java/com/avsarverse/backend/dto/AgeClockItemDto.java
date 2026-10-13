package com.avsarverse.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AgeClockItemDto {
    private Long opportunityId;
    private String title;
    private Integer maxAge;
    private Integer studentCurrentAge;
    private Integer ageLimitYear;
    private int yearsRemaining;
    private int monthsRemaining;
    private Integer maxAttempts;
    private Integer attemptsRemaining;
    private String statusMessage;
    private String urgencyLevel; // "CRITICAL", "MODERATE", "RELAXED"
}
