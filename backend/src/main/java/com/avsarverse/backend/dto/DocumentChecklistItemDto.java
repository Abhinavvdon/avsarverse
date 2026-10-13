package com.avsarverse.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DocumentChecklistItemDto {
    private String key;
    private String label;
    private Long opportunityId;
    private String opportunityTitle;
    private boolean alreadyPossessed;
    private int processingDays;
    private LocalDate deadline;
    private LocalDate startByDate;
    private long daysUntilStartBy;
    private boolean isUrgent;
    private String status; // "READY", "URGENT", "ACTION_REQUIRED"
}
