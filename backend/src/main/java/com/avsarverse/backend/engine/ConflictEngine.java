package com.avsarverse.backend.engine;

import com.avsarverse.backend.dto.ConflictResponseDto;
import com.avsarverse.backend.dto.DateClashDto;
import com.avsarverse.backend.dto.ExclusionConflictDto;
import com.avsarverse.backend.dto.SharedPrepTopicDto;
import com.avsarverse.backend.entity.Opportunity;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

/**
 * ConflictEngine identifies cross-opportunity collisions:
 * 1. Date clashes: exam dates within 2 days (or same day) and deadline collisions within 3 days.
 * 2. Exclusivity conflicts: mutually exclusive scholarship / institutional benefit schemes.
 * 3. Shared preparation topics: syllabus overlap across 2+ selected exams.
 */
@Component
public class ConflictEngine {

    public ConflictResponseDto evaluateConflicts(List<Opportunity> opportunities) {
        if (opportunities == null || opportunities.size() < 2) {
            return ConflictResponseDto.builder()
                    .dateClashes(new ArrayList<>())
                    .exclusionConflicts(new ArrayList<>())
                    .sharedPrep(new ArrayList<>())
                    .totalClashes(0)
                    .totalExclusions(0)
                    .totalSharedTopics(0)
                    .build();
        }

        List<DateClashDto> dateClashes = new ArrayList<>();
        List<ExclusionConflictDto> exclusionConflicts = new ArrayList<>();
        Map<String, List<Opportunity>> topicMap = new HashMap<>();

        int n = opportunities.size();
        for (int i = 0; i < n; i++) {
            Opportunity op1 = opportunities.get(i);

            // Collect topic tags for shared prep
            if (op1.getTopicTags() != null) {
                for (String tag : op1.getTopicTags()) {
                    String cleanTag = tag.trim();
                    if (!cleanTag.isEmpty()) {
                        topicMap.computeIfAbsent(cleanTag, k -> new ArrayList<>()).add(op1);
                    }
                }
            }

            for (int j = i + 1; j < n; j++) {
                Opportunity op2 = opportunities.get(j);

                // Check Exam Date Clashes
                if (op1.getExamDate() != null && op2.getExamDate() != null) {
                    long daysApart = Math.abs(ChronoUnit.DAYS.between(op1.getExamDate(), op2.getExamDate()));
                    if (daysApart == 0) {
                        dateClashes.add(DateClashDto.builder()
                                .opportunity1Id(op1.getId())
                                .opportunity1Title(op1.getTitle())
                                .opportunity2Id(op2.getId())
                                .opportunity2Title(op2.getTitle())
                                .clashType("EXAM_DATE_SAME_DAY")
                                .date1(op1.getExamDate())
                                .date2(op2.getExamDate())
                                .daysApart(0)
                                .severity("CRITICAL")
                                .explanation(String.format("Critical Collision: Both exams are on %s! You cannot appear for both tests on the same date.", op1.getExamDate()))
                                .build());
                    } else if (daysApart <= 2) {
                        dateClashes.add(DateClashDto.builder()
                                .opportunity1Id(op1.getId())
                                .opportunity1Title(op1.getTitle())
                                .opportunity2Id(op2.getId())
                                .opportunity2Title(op2.getTitle())
                                .clashType("EXAM_DATE_PROXIMITY")
                                .date1(op1.getExamDate())
                                .date2(op2.getExamDate())
                                .daysApart(daysApart)
                                .severity("HIGH")
                                .explanation(String.format("High Risk: Exams are only %d day(s) apart (%s vs %s). Inter-city travel and cognitive fatigue pose a severe barrier.",
                                        daysApart, op1.getExamDate(), op2.getExamDate()))
                                .build());
                    }
                }

                // Check Application Deadline Clashes (within 3 days)
                if (op1.getApplicationDeadline() != null && op2.getApplicationDeadline() != null) {
                    long deadlineGap = Math.abs(ChronoUnit.DAYS.between(op1.getApplicationDeadline(), op2.getApplicationDeadline()));
                    if (deadlineGap <= 3) {
                        dateClashes.add(DateClashDto.builder()
                                .opportunity1Id(op1.getId())
                                .opportunity1Title(op1.getTitle())
                                .opportunity2Id(op2.getId())
                                .opportunity2Title(op2.getTitle())
                                .clashType("APPLICATION_DEADLINE_WINDOW")
                                .date1(op1.getApplicationDeadline())
                                .date2(op2.getApplicationDeadline())
                                .daysApart(deadlineGap)
                                .severity(deadlineGap == 0 ? "HIGH" : "MEDIUM")
                                .explanation(String.format("Deadline Crunch: Application deadlines are %s apart (%s vs %s). Risk of document collection bottlenecks.",
                                        deadlineGap == 0 ? "on the exact same day" : String.format("only %d day(s)", deadlineGap),
                                        op1.getApplicationDeadline(), op2.getApplicationDeadline()))
                                .build());
                    }
                }

                // Check Exclusivity Group Conflicts
                if (op1.getExclusivityGroup() != null && !op1.getExclusivityGroup().isBlank() &&
                    op2.getExclusivityGroup() != null && !op2.getExclusivityGroup().isBlank() &&
                    op1.getExclusivityGroup().equalsIgnoreCase(op2.getExclusivityGroup())) {

                    exclusionConflicts.add(ExclusionConflictDto.builder()
                            .exclusivityGroup(op1.getExclusivityGroup())
                            .opportunity1Id(op1.getId())
                            .opportunity1Title(op1.getTitle())
                            .opportunity2Id(op2.getId())
                            .opportunity2Title(op2.getTitle())
                            .explanation(String.format("Mutually Exclusive: Both schemes belong to '%s'. Government and institutional guidelines mandate single-benefit undertakings. You cannot accept or combine both.",
                                    op1.getExclusivityGroup()))
                            .build());
                }
            }
        }

        // Shared preparation topics
        List<SharedPrepTopicDto> sharedPrep = topicMap.entrySet().stream()
                .filter(entry -> entry.getValue().size() >= 2)
                .map(entry -> {
                    List<Opportunity> ops = entry.getValue();
                    return SharedPrepTopicDto.builder()
                            .topic(entry.getKey())
                            .opportunityCount(ops.size())
                            .opportunityIds(ops.stream().map(Opportunity::getId).collect(Collectors.toList()))
                            .opportunityTitles(ops.stream().map(Opportunity::getTitle).collect(Collectors.toList()))
                            .build();
                })
                .sorted((a, b) -> Integer.compare(b.getOpportunityCount(), a.getOpportunityCount()))
                .collect(Collectors.toList());

        return ConflictResponseDto.builder()
                .dateClashes(dateClashes)
                .exclusionConflicts(exclusionConflicts)
                .sharedPrep(sharedPrep)
                .totalClashes(dateClashes.size())
                .totalExclusions(exclusionConflicts.size())
                .totalSharedTopics(sharedPrep.size())
                .build();
    }
}
