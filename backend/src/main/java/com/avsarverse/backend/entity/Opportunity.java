package com.avsarverse.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "opportunities")
public class Opportunity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OpportunityType type;

    @Column(nullable = false)
    private String title;

    private String subtitle;

    @Column(length = 4000)
    private String description;

    private String sourceUrl;

    private LocalDate lastVerified;

    private LocalDate applicationDeadline;

    private LocalDate examDate;

    private Double applicationFee;

    private String exclusivityGroup; // nullable string, e.g. "SCHOLARSHIP_GOVT_SCHEME"

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "opportunity_topic_tags", joinColumns = @JoinColumn(name = "opportunity_id"))
    @Column(name = "tag")
    @Builder.Default
    private List<String> topicTags = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "opportunity_required_docs", joinColumns = @JoinColumn(name = "opportunity_id"))
    @Builder.Default
    private List<RequiredDocument> requiredDocuments = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "opportunity_rules", joinColumns = @JoinColumn(name = "opportunity_id"))
    @Builder.Default
    private List<Rule> rules = new ArrayList<>();

    private Integer maxAge;

    private Integer maxAttempts;

    private Double estimatedTravelCost;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "opportunity_fee_waiver_categories", joinColumns = @JoinColumn(name = "opportunity_id"))
    @Column(name = "category")
    @Builder.Default
    private List<String> feeWaiverCategories = new ArrayList<>();

    @Builder.Default
    private Integer isOutdatedReports = 0;
}
