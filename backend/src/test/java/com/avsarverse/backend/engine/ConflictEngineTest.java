package com.avsarverse.backend.engine;

import com.avsarverse.backend.dto.ConflictResponseDto;
import com.avsarverse.backend.dto.DateClashDto;
import com.avsarverse.backend.dto.ExclusionConflictDto;
import com.avsarverse.backend.entity.Opportunity;
import com.avsarverse.backend.entity.OpportunityType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.util.Arrays;

import static org.junit.jupiter.api.Assertions.*;

public class ConflictEngineTest {

    private ConflictEngine conflictEngine;

    @BeforeEach
    void setUp() {
        conflictEngine = new ConflictEngine();
    }

    @Test
    void testExamDateClashes_SameDayAndProximity() {
        Opportunity op1 = Opportunity.builder()
                .id(1L)
                .title("UPSC CSE 2027")
                .type(OpportunityType.GOVT_EXAM)
                .examDate(LocalDate.of(2027, 5, 23))
                .applicationDeadline(LocalDate.of(2027, 2, 20))
                .build();

        Opportunity op2 = Opportunity.builder()
                .id(2L)
                .title("MPPSC State Services 2027")
                .type(OpportunityType.GOVT_EXAM)
                .examDate(LocalDate.of(2027, 5, 23)) // Same day
                .applicationDeadline(LocalDate.of(2027, 2, 18)) // 2 days apart
                .build();

        ConflictResponseDto response = conflictEngine.evaluateConflicts(Arrays.asList(op1, op2));

        assertNotNull(response);
        assertTrue(response.getTotalClashes() >= 2);

        // Check same day collision
        DateClashDto examClash = response.getDateClashes().stream()
                .filter(c -> "EXAM_DATE_SAME_DAY".equals(c.getClashType()))
                .findFirst().orElse(null);

        assertNotNull(examClash);
        assertEquals("CRITICAL", examClash.getSeverity());
        assertEquals(0, examClash.getDaysApart());
        assertTrue(examClash.getExplanation().contains("Critical Collision"));

        // Check deadline window collision
        DateClashDto deadlineClash = response.getDateClashes().stream()
                .filter(c -> "APPLICATION_DEADLINE_WINDOW".equals(c.getClashType()))
                .findFirst().orElse(null);

        assertNotNull(deadlineClash);
        assertEquals(2, deadlineClash.getDaysApart());
    }

    @Test
    void testExclusionConflicts_MutuallyExclusiveSchemes() {
        Opportunity op1 = Opportunity.builder()
                .id(10L)
                .title("MP MMVY Scholarship 2026-27")
                .type(OpportunityType.SCHOLARSHIP)
                .exclusivityGroup("MP_STATE_MERIT_OR_CENTRAL_SCHOLARSHIP")
                .build();

        Opportunity op2 = Opportunity.builder()
                .id(11L)
                .title("Central Sector Scholarship (CSSS)")
                .type(OpportunityType.SCHOLARSHIP)
                .exclusivityGroup("MP_STATE_MERIT_OR_CENTRAL_SCHOLARSHIP")
                .build();

        ConflictResponseDto response = conflictEngine.evaluateConflicts(Arrays.asList(op1, op2));

        assertEquals(1, response.getTotalExclusions());
        ExclusionConflictDto conflict = response.getExclusionConflicts().get(0);
        assertEquals("MP_STATE_MERIT_OR_CENTRAL_SCHOLARSHIP", conflict.getExclusivityGroup());
        assertTrue(conflict.getExplanation().contains("Mutually Exclusive"));
    }

    @Test
    void testSharedPreparationTopics_OverlapDetection() {
        Opportunity op1 = Opportunity.builder()
                .id(1L)
                .title("GATE 2027")
                .topicTags(Arrays.asList("Quantitative Aptitude", "Core Engineering", "Logical Reasoning"))
                .build();

        Opportunity op2 = Opportunity.builder()
                .id(2L)
                .title("SSC CGL 2027")
                .topicTags(Arrays.asList("Quantitative Aptitude", "General Awareness", "Logical Reasoning"))
                .build();

        ConflictResponseDto response = conflictEngine.evaluateConflicts(Arrays.asList(op1, op2));

        assertTrue(response.getTotalSharedTopics() >= 2);
        assertTrue(response.getSharedPrep().stream().anyMatch(t -> "Quantitative Aptitude".equalsIgnoreCase(t.getTopic())));
        assertTrue(response.getSharedPrep().stream().anyMatch(t -> "Logical Reasoning".equalsIgnoreCase(t.getTopic())));
    }
}
