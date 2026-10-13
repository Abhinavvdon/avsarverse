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
public class DateClashDto {
    private Long opportunity1Id;
    private String opportunity1Title;
    private Long opportunity2Id;
    private String opportunity2Title;
    private String clashType; // "EXAM_DATE_SAME_DAY", "EXAM_DATE_PROXIMITY", "APPLICATION_DEADLINE_WINDOW"
    private LocalDate date1;
    private LocalDate date2;
    private long daysApart;
    private String severity; // "CRITICAL", "HIGH", "MEDIUM"
    private String explanation;
}
