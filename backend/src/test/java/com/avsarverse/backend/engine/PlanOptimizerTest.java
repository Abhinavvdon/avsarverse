package com.avsarverse.backend.engine;

import com.avsarverse.backend.dto.BestPlanResponseDto;
import com.avsarverse.backend.entity.Opportunity;
import com.avsarverse.backend.entity.OpportunityType;
import com.avsarverse.backend.entity.StudentProfile;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.util.Arrays;

import static org.junit.jupiter.api.Assertions.*;

public class PlanOptimizerTest {

    private PlanOptimizer planOptimizer;
    private RuleEvaluator ruleEvaluator;

    @BeforeEach
    void setUp() {
        ruleEvaluator = new RuleEvaluator();
        planOptimizer = new PlanOptimizer(ruleEvaluator);
    }

    @Test
    void testPlanOptimizer_PrunesClashesAndExclusions() {
        StudentProfile student = StudentProfile.builder()
                .percentage(85.0)
                .familyIncome(200000.0)
                .age(22)
                .state("Madhya Pradesh")
                .course("B.Tech Computer Science")
                .yearOfStudy(4)
                .build();

        // Op1 & Op2 share an exclusivity group
        Opportunity op1 = Opportunity.builder()
                .id(1L)
                .title("MMVY Scholarship")
                .type(OpportunityType.SCHOLARSHIP)
                .exclusivityGroup("GOVT_SCHEME")
                .applicationDeadline(LocalDate.now().plusMonths(2))
                .topicTags(Arrays.asList("Academics", "State Merit"))
                .build();

        Opportunity op2 = Opportunity.builder()
                .id(2L)
                .title("Central Sector Scholarship")
                .type(OpportunityType.SCHOLARSHIP)
                .exclusivityGroup("GOVT_SCHEME") // Collision with op1
                .applicationDeadline(LocalDate.now().plusMonths(2))
                .topicTags(Arrays.asList("Academics", "National Merit"))
                .build();

        // Op3 & Op4 clash on same exam date
        Opportunity op3 = Opportunity.builder()
                .id(3L)
                .title("UPSC CSE 2027")
                .type(OpportunityType.GOVT_EXAM)
                .examDate(LocalDate.of(2027, 5, 23))
                .topicTags(Arrays.asList("Quantitative Aptitude", "General Awareness"))
                .build();

        Opportunity op4 = Opportunity.builder()
                .id(4L)
                .title("MPPSC State Services 2027")
                .type(OpportunityType.GOVT_EXAM)
                .examDate(LocalDate.of(2027, 5, 23)) // Collision with op3
                .topicTags(Arrays.asList("Quantitative Aptitude", "Madhya Pradesh GK"))
                .build();

        BestPlanResponseDto plan = planOptimizer.optimizePlan(Arrays.asList(op1, op2, op3, op4), 4, student);

        assertNotNull(plan);
        // From op1 & op2 only 1 should be chosen
        long chosenExclusives = plan.getChosenOpportunities().stream()
                .filter(o -> "GOVT_SCHEME".equals(o.getExclusivityGroup()))
                .count();
        assertEquals(1, chosenExclusives);

        // From op3 & op4 only 1 should be chosen because exam dates clash
        long chosenExamsOnDate = plan.getChosenOpportunities().stream()
                .filter(o -> LocalDate.of(2027, 5, 23).equals(o.getExamDate()))
                .count();
        assertEquals(1, chosenExamsOnDate);

        // Verify rejected list reasons
        assertTrue(plan.getRejectedOpportunities().stream().anyMatch(r -> "EXCLUSION_CONFLICT".equals(r.getRejectionType())));
        assertTrue(plan.getRejectedOpportunities().stream().anyMatch(r -> "DATE_CLASH".equals(r.getRejectionType())));

        // Verify combined study plan is populated
        assertFalse(plan.getCombinedStudyPlan().isEmpty());
    }
}
