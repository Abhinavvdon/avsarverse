package com.avsarverse.backend.dto;

import com.avsarverse.backend.entity.OpportunityType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DeadlineDto {
    private Long opportunityId;
    private String title;
    private OpportunityType type;
    private LocalDate applicationDeadline;
    private LocalDate examDate;
    private long daysLeft;
    private String urgency; // "CRITICAL", "HIGH", "NORMAL", "EXPIRED"
    private String urgencyColor; // "RED", "YELLOW", "GREEN", "GRAY"
    private boolean isExpired;
}
