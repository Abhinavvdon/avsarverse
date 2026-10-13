package com.avsarverse.backend.engine;

import com.avsarverse.backend.dto.CriterionResultDto;
import com.avsarverse.backend.dto.EligibilityResultDto;
import com.avsarverse.backend.entity.Opportunity;
import com.avsarverse.backend.entity.Rule;
import com.avsarverse.backend.entity.RuleField;
import com.avsarverse.backend.entity.RuleOperator;
import com.avsarverse.backend.entity.StudentProfile;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

/**
 * RuleEvaluator independently evaluates each eligibility rule against a student's profile.
 * Generates human-friendly gap explanations with exact numeric or categorical variances.
 */
@Component
public class RuleEvaluator {

    public CriterionResultDto evaluateRule(Rule rule, StudentProfile student) {
        if (rule == null || rule.getField() == null) {
            return CriterionResultDto.builder()
                    .label("Unspecified criterion")
                    .passed(true)
                    .studentValue("N/A")
                    .requiredValue("N/A")
                    .gapExplanation("Criterion passed by default")
                    .build();
        }

        switch (rule.getField()) {
            case percentage:
                return evaluatePercentage(rule, student);
            case familyIncome:
                return evaluateFamilyIncome(rule, student);
            case age:
                return evaluateAge(rule, student);
            case course:
                return evaluateCourse(rule, student);
            case yearOfStudy:
                return evaluateYearOfStudy(rule, student);
            case category:
                return evaluateCategory(rule, student);
            case state:
                return evaluateState(rule, student);
            default:
                return CriterionResultDto.builder()
                        .label(rule.getLabel() != null ? rule.getLabel() : "General rule")
                        .passed(true)
                        .studentValue("N/A")
                        .requiredValue(rule.getValue())
                        .gapExplanation("Rule passed")
                        .build();
        }
    }

    private CriterionResultDto evaluatePercentage(Rule rule, StudentProfile student) {
        double studentVal = student.getPercentage() != null ? student.getPercentage() : 0.0;
        double reqVal;
        try {
            reqVal = Double.parseDouble(rule.getValue().replaceAll("[^0-9.]", "").trim());
        } catch (Exception e) {
            reqVal = 60.0;
        }

        boolean passed;
        String gapExplanation;

        if (rule.getOperator() != null && rule.getOperator().name().equals("LTE")) {
            passed = studentVal <= reqVal;
            if (!passed) {
                double gap = studentVal - reqVal;
                gapExplanation = String.format("Percentage %.1f%% exceeds upper ceiling of %.1f%% by %.1f%%", studentVal, reqVal, gap);
            } else {
                gapExplanation = String.format("Score %.1f%% is within the allowed ceiling of %.1f%%", studentVal, reqVal);
            }
        } else {
            // Default GTE
            passed = studentVal >= reqVal;
            if (!passed) {
                double gap = reqVal - studentVal;
                gapExplanation = String.format("You need %.1f%% more marks (current: %.1f%%, required: ≥ %.1f%%)", gap, studentVal, reqVal);
            } else {
                gapExplanation = String.format("Qualifies: Your score of %.1f%% meets the required minimum of %.1f%%", studentVal, reqVal);
            }
        }

        return CriterionResultDto.builder()
                .label(rule.getLabel() != null ? rule.getLabel() : "Academic Percentage Requirement")
                .passed(passed)
                .studentValue(String.format("%.1f%%", studentVal))
                .requiredValue(String.format("≥ %.1f%%", reqVal))
                .gapExplanation(gapExplanation)
                .build();
    }

    private CriterionResultDto evaluateFamilyIncome(Rule rule, StudentProfile student) {
        double studentVal = student.getFamilyIncome() != null ? student.getFamilyIncome() : 0.0;
        double reqVal;
        try {
            reqVal = Double.parseDouble(rule.getValue().replaceAll("[^0-9.]", "").trim());
        } catch (Exception e) {
            reqVal = 800000.0;
        }

        boolean passed;
        String gapExplanation;

        if (rule.getOperator() != null && rule.getOperator().name().equals("GTE")) {
            passed = studentVal >= reqVal;
            if (!passed) {
                double gap = reqVal - studentVal;
                gapExplanation = String.format("Family income is ₹%,.0f below required minimum threshold (current: ₹%,.0f, required: ≥ ₹%,.0f)", gap, studentVal, reqVal);
            } else {
                gapExplanation = String.format("Qualifies: Family income ₹%,.0f satisfies the requirement", studentVal);
            }
        } else {
            // Default LTE (income ceiling for scholarships)
            passed = studentVal <= reqVal;
            if (!passed) {
                double gap = studentVal - reqVal;
                gapExplanation = String.format("Family income is ₹%,.0f above the limit (current: ₹%,.0f, required: ≤ ₹%,.0f)", gap, studentVal, reqVal);
            } else {
                gapExplanation = String.format("Qualifies: Family income ₹%,.0f is well within the ceiling limit of ₹%,.0f", studentVal, reqVal);
            }
        }

        return CriterionResultDto.builder()
                .label(rule.getLabel() != null ? rule.getLabel() : "Annual Family Income Limit")
                .passed(passed)
                .studentValue(String.format("₹%,.0f/yr", studentVal))
                .requiredValue(String.format("≤ ₹%,.0f/yr", reqVal))
                .gapExplanation(gapExplanation)
                .build();
    }

    private CriterionResultDto evaluateAge(Rule rule, StudentProfile student) {
        int studentVal = student.getAge() != null ? student.getAge() : 21;
        int reqVal;
        try {
            reqVal = Integer.parseInt(rule.getValue().replaceAll("[^0-9]", "").trim());
        } catch (Exception e) {
            reqVal = 30;
        }

        boolean passed;
        String gapExplanation;

        if (rule.getOperator() != null && rule.getOperator().name().equals("GTE")) {
            passed = studentVal >= reqVal;
            if (!passed) {
                int gap = reqVal - studentVal;
                gapExplanation = String.format("Must be at least %d years old (current age: %d, %d %s needed)", reqVal, studentVal, gap, gap == 1 ? "year" : "years");
            } else {
                gapExplanation = String.format("Qualifies: Age %d satisfies minimum age requirement of %d", studentVal, reqVal);
            }
        } else {
            // Default LTE (maximum age limit)
            passed = studentVal <= reqVal;
            if (!passed) {
                int gap = studentVal - reqVal;
                gapExplanation = String.format("Age %d exceeds max age %d by %d %s", studentVal, reqVal, gap, gap == 1 ? "year" : "years");
            } else {
                gapExplanation = String.format("Qualifies: Age %d is within the maximum limit of %d years", studentVal, reqVal);
            }
        }

        return CriterionResultDto.builder()
                .label(rule.getLabel() != null ? rule.getLabel() : "Age Limit Requirement")
                .passed(passed)
                .studentValue(String.valueOf(studentVal))
                .requiredValue(String.valueOf(reqVal))
                .gapExplanation(gapExplanation)
                .build();
    }

    private CriterionResultDto evaluateCourse(Rule rule, StudentProfile student) {
        String studentVal = student.getCourse() != null ? student.getCourse().trim() : "";
        String reqVal = rule.getValue() != null ? rule.getValue().trim() : "";

        List<String> allowed = Arrays.stream(reqVal.split("[,;/|]"))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toList());

        boolean passed = allowed.isEmpty() || allowed.stream().anyMatch(req ->
                studentVal.equalsIgnoreCase(req) ||
                studentVal.toLowerCase().contains(req.toLowerCase()) ||
                req.toLowerCase().contains(studentVal.toLowerCase()) ||
                (req.equalsIgnoreCase("B.Tech") && studentVal.toLowerCase().contains("engineering")) ||
                (req.equalsIgnoreCase("Engineering") && (studentVal.toLowerCase().contains("b.tech") || studentVal.toLowerCase().contains("b.e.")))
        );

        String gapExplanation;
        if (!passed) {
            gapExplanation = String.format("Requires course in [%s] (your current course: %s)", reqVal, studentVal.isEmpty() ? "Not specified" : studentVal);
        } else {
            gapExplanation = String.format("Course '%s' qualifies under eligible degree paths: %s", studentVal, reqVal);
        }

        return CriterionResultDto.builder()
                .label(rule.getLabel() != null ? rule.getLabel() : "Course / Degree Program")
                .passed(passed)
                .studentValue(studentVal)
                .requiredValue(reqVal)
                .gapExplanation(gapExplanation)
                .build();
    }

    private CriterionResultDto evaluateYearOfStudy(Rule rule, StudentProfile student) {
        int studentVal = student.getYearOfStudy() != null ? student.getYearOfStudy() : 4;
        String reqVal = rule.getValue() != null ? rule.getValue().trim() : "4";

        boolean passed;
        String gapExplanation;

        if (rule.getOperator() != null && rule.getOperator().name().equals("GTE")) {
            int minYear = 4;
            try {
                minYear = Integer.parseInt(reqVal.replaceAll("[^0-9]", ""));
            } catch (Exception ignored) {}
            passed = studentVal >= minYear;
            if (!passed) {
                gapExplanation = String.format("Requires at least Year %d (current: Year %d)", minYear, studentVal);
            } else {
                gapExplanation = String.format("Year %d meets requirement of ≥ Year %d", studentVal, minYear);
            }
        } else {
            List<String> allowedYears = Arrays.stream(reqVal.split("[,;/|]"))
                    .map(s -> s.replaceAll("[^0-9]", "").trim())
                    .filter(s -> !s.isEmpty())
                    .collect(Collectors.toList());

            passed = allowedYears.isEmpty() || allowedYears.contains(String.valueOf(studentVal));
            if (!passed) {
                gapExplanation = String.format("Requires study year [%s] (current: Year %d)", reqVal, studentVal);
            } else {
                gapExplanation = String.format("Year %d satisfies target study stage [%s]", studentVal, reqVal);
            }
        }

        return CriterionResultDto.builder()
                .label(rule.getLabel() != null ? rule.getLabel() : "Year of Study Requirement")
                .passed(passed)
                .studentValue("Year " + studentVal)
                .requiredValue(reqVal)
                .gapExplanation(gapExplanation)
                .build();
    }

    private CriterionResultDto evaluateCategory(Rule rule, StudentProfile student) {
        String studentCat = student.getCategory() != null ? student.getCategory().trim() : "General";
        String reqVal = rule.getValue() != null ? rule.getValue().trim() : "General, OBC, SC, ST, EWS";

        List<String> allowed = Arrays.stream(reqVal.split("[,;/|]"))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toList());

        boolean passed = allowed.isEmpty() ||
                allowed.stream().anyMatch(cat -> cat.equalsIgnoreCase("All") || cat.equalsIgnoreCase(studentCat));

        String gapExplanation;
        if (!passed) {
            gapExplanation = String.format("Reserved for [%s] categories (your registered category: %s)", reqVal, studentCat);
        } else {
            gapExplanation = String.format("Category '%s' is eligible under [%s]", studentCat, reqVal);
        }

        return CriterionResultDto.builder()
                .label(rule.getLabel() != null ? rule.getLabel() : "Social Category / Reservation")
                .passed(passed)
                .studentValue(studentCat)
                .requiredValue(reqVal)
                .gapExplanation(gapExplanation)
                .build();
    }

    private CriterionResultDto evaluateState(Rule rule, StudentProfile student) {
        String studentState = student.getState() != null ? student.getState().trim() : "Madhya Pradesh";
        String reqVal = rule.getValue() != null ? rule.getValue().trim() : "All India";

        List<String> allowed = Arrays.stream(reqVal.split("[,;/|]"))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toList());

        boolean isAllIndia = allowed.stream().anyMatch(s ->
                s.equalsIgnoreCase("All India") || s.equalsIgnoreCase("National") || s.equalsIgnoreCase("Pan India"));

        boolean passed = isAllIndia || allowed.stream().anyMatch(s -> s.equalsIgnoreCase(studentState));

        String gapExplanation;
        if (!passed) {
            gapExplanation = String.format("Requires domicile in [%s] (your state: %s)", reqVal, studentState);
        } else {
            gapExplanation = isAllIndia ?
                    String.format("Open pan-India to all domiciles (including %s)", studentState) :
                    String.format("Domicile '%s' satisfies state criteria [%s]", studentState, reqVal);
        }

        return CriterionResultDto.builder()
                .label(rule.getLabel() != null ? rule.getLabel() : "Domicile State Requirement")
                .passed(passed)
                .studentValue(studentState)
                .requiredValue(reqVal)
                .gapExplanation(gapExplanation)
                .build();
    }

    public EligibilityResultDto evaluateOpportunity(Opportunity opportunity, StudentProfile student) {
        List<Rule> rules = opportunity.getRules();
        if (rules == null || rules.isEmpty()) {
            return EligibilityResultDto.builder()
                    .opportunityId(opportunity.getId())
                    .opportunity(opportunity)
                    .eligible(true)
                    .matchScore(100)
                    .status("ELIGIBLE")
                    .criteria(new ArrayList<>())
                    .primaryGap(null)
                    .build();
        }

        List<CriterionResultDto> criteriaResults = new ArrayList<>();
        int passedCount = 0;
        CriterionResultDto firstFailure = null;
        boolean hasNearMiss = false;

        for (Rule rule : rules) {
            CriterionResultDto res = evaluateRule(rule, student);
            criteriaResults.add(res);
            if (res.isPassed()) {
                passedCount++;
            } else {
                if (firstFailure == null) {
                    firstFailure = res;
                }
                // Check if near miss
                if (rule.getField() == RuleField.percentage) {
                    double s = student.getPercentage() != null ? student.getPercentage() : 0.0;
                    double req = 60.0;
                    try { req = Double.parseDouble(rule.getValue().replaceAll("[^0-9.]", "")); } catch (Exception ignored) {}
                    if (s >= (req - 5.0)) hasNearMiss = true;
                } else if (rule.getField() == RuleField.familyIncome) {
                    double s = student.getFamilyIncome() != null ? student.getFamilyIncome() : 0.0;
                    double req = 250000.0;
                    try { req = Double.parseDouble(rule.getValue().replaceAll("[^0-9.]", "")); } catch (Exception ignored) {}
                    if (s <= (req * 1.25)) hasNearMiss = true;
                }
            }
        }

        boolean fullyEligible = (passedCount == rules.size());
        int matchScore;
        String status;

        if (fullyEligible) {
            matchScore = 90 + Math.min(10, (int) Math.round((student.getPercentage() != null ? student.getPercentage() : 70.0) / 10.0));
            status = "ELIGIBLE";
        } else if (passedCount >= rules.size() - 1 && hasNearMiss) {
            matchScore = Math.max(55, Math.min(78, (int) Math.round(((double) passedCount / rules.size()) * 80)));
            status = "ALMOST_ELIGIBLE";
        } else {
            matchScore = Math.max(15, (int) Math.round(((double) passedCount / rules.size()) * 55));
            status = "NOT_ELIGIBLE";
        }

        return EligibilityResultDto.builder()
                .opportunityId(opportunity.getId())
                .opportunity(opportunity)
                .eligible(fullyEligible)
                .matchScore(matchScore)
                .status(status)
                .criteria(criteriaResults)
                .primaryGap(firstFailure != null ? firstFailure.getGapExplanation() : null)
                .build();
    }
}
