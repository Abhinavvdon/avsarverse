package com.avsarverse.backend.engine;

import com.avsarverse.backend.dto.BestPlanResponseDto;
import com.avsarverse.backend.dto.EligibilityResultDto;
import com.avsarverse.backend.dto.RejectedOpportunityDto;
import com.avsarverse.backend.dto.StudyPlanItemDto;
import com.avsarverse.backend.entity.Opportunity;
import com.avsarverse.backend.entity.StudentProfile;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

/**
 * PlanOptimizer chooses the optimal non-conflicting subset of opportunities
 * using weighted selection (matchScore + prep-overlap bonus + urgency)
 * with strict mutual-exclusion and exam date clash pruning.
 */
@Component
public class PlanOptimizer {

    private final RuleEvaluator ruleEvaluator;

    public PlanOptimizer(RuleEvaluator ruleEvaluator) {
        this.ruleEvaluator = ruleEvaluator;
    }

    public BestPlanResponseDto optimizePlan(List<Opportunity> candidates, int maxPick, StudentProfile student) {
        if (candidates == null || candidates.isEmpty()) {
            return BestPlanResponseDto.builder()
                    .chosenOpportunities(new ArrayList<>())
                    .rejectedOpportunities(new ArrayList<>())
                    .combinedStudyPlan(new ArrayList<>())
                    .totalPreparationTopics(0)
                    .estimatedTotalHours(0)
                    .totalOpportunitiesEvaluated(0)
                    .chosenCount(0)
                    .compositeScore(0.0)
                    .executiveSummary("No candidate opportunities provided for combination analysis.")
                    .build();
        }

        int targetLimit = maxPick > 0 ? maxPick : 3;

        // Step 1: Calculate weights for each candidate
        Map<Opportunity, Double> weights = new HashMap<>();
        Map<Opportunity, EligibilityResultDto> eligibilityMap = new HashMap<>();

        // Global topic frequencies among candidates
        Map<String, Integer> topicFreq = new HashMap<>();
        for (Opportunity op : candidates) {
            if (op.getTopicTags() != null) {
                for (String tag : op.getTopicTags()) {
                    topicFreq.put(tag.toLowerCase().trim(), topicFreq.getOrDefault(tag.toLowerCase().trim(), 0) + 1);
                }
            }
        }

        LocalDate now = LocalDate.now();

        for (Opportunity op : candidates) {
            EligibilityResultDto elig = student != null ?
                    ruleEvaluator.evaluateOpportunity(op, student) :
                    EligibilityResultDto.builder().eligible(true).matchScore(85).build();
            eligibilityMap.put(op, elig);

            double score = elig.getMatchScore();

            // Prep overlap bonus
            int overlapCount = 0;
            if (op.getTopicTags() != null) {
                for (String tag : op.getTopicTags()) {
                    if (topicFreq.getOrDefault(tag.toLowerCase().trim(), 0) > 1) {
                        overlapCount++;
                    }
                }
            }
            double overlapBonus = overlapCount * 12.0;

            // Deadline urgency bonus (prioritize upcoming actionable deadlines)
            double urgencyBonus = 0.0;
            if (op.getApplicationDeadline() != null) {
                long days = ChronoUnit.DAYS.between(now, op.getApplicationDeadline());
                if (days > 0 && days <= 60) {
                    urgencyBonus = Math.max(0, (60 - days) * 0.25);
                }
            }

            double totalWeight = score + overlapBonus + urgencyBonus;
            weights.put(op, totalWeight);
        }

        // Sort candidates descending by total weight
        List<Opportunity> sorted = new ArrayList<>(candidates);
        sorted.sort((a, b) -> Double.compare(weights.get(b), weights.get(a)));

        List<Opportunity> chosen = new ArrayList<>();
        List<RejectedOpportunityDto> rejected = new ArrayList<>();

        // Step 2: Greedy selection with clash & exclusion filters
        for (Opportunity candidate : sorted) {
            EligibilityResultDto elig = eligibilityMap.get(candidate);
            if (elig != null && !elig.isEligible() && elig.getMatchScore() < 40) {
                rejected.add(RejectedOpportunityDto.builder()
                        .opportunityId(candidate.getId())
                        .title(candidate.getTitle())
                        .rejectionType("LOW_MATCH_SCORE")
                        .reason("Eliminated due to low eligibility readiness: " + (elig.getPrimaryGap() != null ? elig.getPrimaryGap() : "Did not satisfy core criteria."))
                        .build());
                continue;
            }

            if (chosen.size() >= targetLimit) {
                rejected.add(RejectedOpportunityDto.builder()
                        .opportunityId(candidate.getId())
                        .title(candidate.getTitle())
                        .rejectionType("CAPACITY_LIMIT")
                        .reason(String.format("Exceeds target limit of %d concurrent opportunities. Ranked lower than selected top combinations.", targetLimit))
                        .build());
                continue;
            }

            // Check collision with already chosen
            boolean conflictFound = false;
            for (Opportunity selected : chosen) {
                // 1. Exclusivity group check
                if (candidate.getExclusivityGroup() != null && !candidate.getExclusivityGroup().isBlank() &&
                    selected.getExclusivityGroup() != null && !selected.getExclusivityGroup().isBlank() &&
                    candidate.getExclusivityGroup().equalsIgnoreCase(selected.getExclusivityGroup())) {

                    rejected.add(RejectedOpportunityDto.builder()
                            .opportunityId(candidate.getId())
                            .title(candidate.getTitle())
                            .rejectionType("EXCLUSION_CONFLICT")
                            .reason(String.format("Mutually exclusive with '%s' (Group: %s). Simultaneous awards prohibited.",
                                    selected.getTitle(), candidate.getExclusivityGroup()))
                            .build());
                    conflictFound = true;
                    break;
                }

                // 2. Exam date clash check (within 2 days)
                if (candidate.getExamDate() != null && selected.getExamDate() != null) {
                    long days = Math.abs(ChronoUnit.DAYS.between(candidate.getExamDate(), selected.getExamDate()));
                    if (days <= 2) {
                        rejected.add(RejectedOpportunityDto.builder()
                                .opportunityId(candidate.getId())
                                .title(candidate.getTitle())
                                .rejectionType("DATE_CLASH")
                                .reason(String.format("Exam date (%s) clashes with chosen '%s' (%s - %s apart).",
                                        candidate.getExamDate(), selected.getTitle(), selected.getExamDate(),
                                        days == 0 ? "same date" : days + " day(s)"))
                                .build());
                        conflictFound = true;
                        break;
                    }
                }
            }

            if (!conflictFound) {
                chosen.add(candidate);
            }
        }

        // Step 3: Build Combined Study Plan grouped by shared topics
        Map<String, List<String>> topicToOpportunities = new LinkedHashMap<>();
        for (Opportunity op : chosen) {
            if (op.getTopicTags() != null) {
                for (String tag : op.getTopicTags()) {
                    topicToOpportunities.computeIfAbsent(tag.trim(), k -> new ArrayList<>()).add(op.getTitle());
                }
            }
        }

        List<StudyPlanItemDto> combinedStudyPlan = new ArrayList<>();
        int totalHours = 0;

        for (Map.Entry<String, List<String>> entry : topicToOpportunities.entrySet()) {
            String topic = entry.getKey();
            List<String> ops = entry.getValue();
            int hours = 25 + (ops.size() * 15);
            totalHours += hours;

            List<String> subtopics = getSubtopicsForTopic(topic);
            String tip = String.format("High ROI: Master this section once to gain scoring advantage across %d selected exams (%s).",
                    ops.size(), String.join(", ", ops));

            combinedStudyPlan.add(StudyPlanItemDto.builder()
                    .topic(topic)
                    .hoursSuggested(hours)
                    .coveredOpportunities(ops)
                    .coreSubtopics(subtopics)
                    .strategyTip(tip)
                    .build());
        }

        // Sort study plan by covered opportunities count descending
        combinedStudyPlan.sort((a, b) -> Integer.compare(b.getCoveredOpportunities().size(), a.getCoveredOpportunities().size()));

        double avgComposite = chosen.stream().mapToDouble(weights::get).average().orElse(0.0);

        String summary = String.format("Successfully synthesized an optimal %d-opportunity trajectory. Zero exam collisions, 100%% regulatory exclusivity compliance, and %d high-leverage preparation modules yielding shared study synergy.",
                chosen.size(), combinedStudyPlan.size());

        return BestPlanResponseDto.builder()
                .chosenOpportunities(chosen)
                .rejectedOpportunities(rejected)
                .combinedStudyPlan(combinedStudyPlan)
                .totalPreparationTopics(combinedStudyPlan.size())
                .estimatedTotalHours(totalHours)
                .totalOpportunitiesEvaluated(candidates.size())
                .chosenCount(chosen.size())
                .compositeScore(Math.round(avgComposite * 10.0) / 10.0)
                .executiveSummary(summary)
                .build();
    }

    private List<String> getSubtopicsForTopic(String topic) {
        String lower = topic.toLowerCase();
        if (lower.contains("quant") || lower.contains("aptitude")) {
            return Arrays.asList("Arithmetic (Percentages, Profit/Loss, Ratios)", "Algebra & Number Theory", "Data Interpretation & Graphs", "Speed Math & Geometry");
        } else if (lower.contains("reason") || lower.contains("logical")) {
            return Arrays.asList("Seating Arrangements & Puzzles", "Syllogisms & Deductions", "Coding-Decoding & Series", "Critical & Analytical Reasoning");
        } else if (lower.contains("english") || lower.contains("verbal")) {
            return Arrays.asList("Reading Comprehension", "Error Spotting & Grammar", "Vocabulary in Context", "Sentence Rearrangement");
        } else if (lower.contains("general awareness") || lower.contains("gk") || lower.contains("current affairs")) {
            return Arrays.asList("National & MP State Current Affairs", "Indian Polity & Constitution", "Indian Economy & Budget", "Science & Technology Developments");
        } else if (lower.contains("engineering") || lower.contains("core") || lower.contains("computer science") || lower.contains("technical")) {
            return Arrays.asList("Data Structures & Algorithms", "Operating Systems & Networking", "Database Management Systems", "Digital Logic & Computer Architecture");
        } else {
            return Arrays.asList("Core Fundamentals", "Previous Year Question Patterns", "Speed & Accuracy Drills", "Full-Length Mock Tests");
        }
    }
}
