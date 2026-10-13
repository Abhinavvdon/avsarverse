package com.avsarverse.backend.engine;

import com.avsarverse.backend.dto.CriterionResultDto;
import com.avsarverse.backend.dto.EligibilityResultDto;
import com.avsarverse.backend.entity.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Arrays;
import java.util.Collections;

import static org.junit.jupiter.api.Assertions.*;

public class RuleEvaluatorTest {

    private RuleEvaluator evaluator;

    @BeforeEach
    void setUp() {
        evaluator = new RuleEvaluator();
    }

    @Test
    void testPercentageRule_SuccessAndGapExplanation() {
        Rule rule = Rule.builder()
                .field(RuleField.percentage)
                .operator(RuleOperator.GTE)
                .value("75.0")
                .label("Minimum 75% marks")
                .build();

        // Case 1: Student qualifies (78.5% >= 75%)
        StudentProfile passingStudent = StudentProfile.builder().percentage(78.5).build();
        CriterionResultDto passResult = evaluator.evaluateRule(rule, passingStudent);
        assertTrue(passResult.isPassed());
        assertTrue(passResult.getGapExplanation().contains("Qualifies"));

        // Case 2: Student fails (70.0% < 75%) - verifies exact human gap
        StudentProfile failingStudent = StudentProfile.builder().percentage(70.0).build();
        CriterionResultDto failResult = evaluator.evaluateRule(rule, failingStudent);
        assertFalse(failResult.isPassed());
        assertTrue(failResult.getGapExplanation().contains("You need 5.0% more marks"));
        assertEquals("70.0%", failResult.getStudentValue());
    }

    @Test
    void testFamilyIncomeRule_CeilingAndGapExplanation() {
        Rule rule = Rule.builder()
                .field(RuleField.familyIncome)
                .operator(RuleOperator.LTE)
                .value("250000")
                .label("Annual family income ceiling")
                .build();

        // Student has income of 2,90,000 (exceeds limit by 40,000)
        StudentProfile richStudent = StudentProfile.builder().familyIncome(290000.0).build();
        CriterionResultDto result = evaluator.evaluateRule(rule, richStudent);

        assertFalse(result.isPassed());
        assertTrue(result.getGapExplanation().contains("Family income is ₹40,000 above the limit"));
    }

    @Test
    void testAgeRule_MaxLimitAndAgeOutGap() {
        Rule rule = Rule.builder()
                .field(RuleField.age)
                .operator(RuleOperator.LTE)
                .value("25")
                .label("Age not exceeding 25")
                .build();

        StudentProfile olderStudent = StudentProfile.builder().age(26).build();
        CriterionResultDto result = evaluator.evaluateRule(rule, olderStudent);

        assertFalse(result.isPassed());
        assertTrue(result.getGapExplanation().contains("Age 26 exceeds max age 25 by 1 year"));
    }

    @Test
    void testCategoryRule_ReservationCheck() {
        Rule rule = Rule.builder()
                .field(RuleField.category)
                .operator(RuleOperator.IN)
                .value("SC, ST")
                .label("Category reservation")
                .build();

        StudentProfile generalStudent = StudentProfile.builder().category("General").build();
        CriterionResultDto failResult = evaluator.evaluateRule(rule, generalStudent);
        assertFalse(failResult.isPassed());
        assertTrue(failResult.getGapExplanation().contains("Reserved for [SC, ST] categories"));

        StudentProfile scStudent = StudentProfile.builder().category("SC").build();
        CriterionResultDto passResult = evaluator.evaluateRule(rule, scStudent);
        assertTrue(passResult.isPassed());
    }

    @Test
    void testOpportunityEvaluation_CompositeScore() {
        Opportunity op = Opportunity.builder()
                .id(99L)
                .title("Sample Test Opportunity")
                .rules(Arrays.asList(
                        Rule.builder().field(RuleField.percentage).operator(RuleOperator.GTE).value("60").build(),
                        Rule.builder().field(RuleField.state).operator(RuleOperator.EQ).value("Madhya Pradesh").build()
                ))
                .build();

        StudentProfile student = StudentProfile.builder()
                .percentage(80.0)
                .state("Madhya Pradesh")
                .build();

        EligibilityResultDto res = evaluator.evaluateOpportunity(op, student);
        assertTrue(res.isEligible());
        assertEquals("ELIGIBLE", res.getStatus());
        assertTrue(res.getMatchScore() >= 90);
    }
}
