package com.avsarverse.backend.dto;

import com.avsarverse.backend.entity.OpportunityType;
import com.avsarverse.backend.entity.RequiredDocument;
import com.avsarverse.backend.entity.Rule;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NoticeDraftDto {
    private String title;
    private String subtitle;
    private String description;
    private OpportunityType type;
    private String sourceUrl;
    private LocalDate applicationDeadline;
    private LocalDate examDate;
    private Double applicationFee;
    private String exclusivityGroup;
    private List<Rule> rules;
    private List<RequiredDocument> requiredDocuments;
    private List<String> topicTags;
    private Integer maxAge;
    private Integer maxAttempts;
    private Double estimatedTravelCost;
    private List<String> feeWaiverCategories;
    private boolean isMockNotice;
    private String note;
}
