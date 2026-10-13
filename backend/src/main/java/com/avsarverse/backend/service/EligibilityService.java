package com.avsarverse.backend.service;

import com.avsarverse.backend.dto.EligibilityResultDto;
import com.avsarverse.backend.dto.OpportunityDiffDto;
import com.avsarverse.backend.dto.SimulatorRequestDto;
import com.avsarverse.backend.dto.SimulatorResponseDto;
import com.avsarverse.backend.engine.RuleEvaluator;
import com.avsarverse.backend.entity.Opportunity;
import com.avsarverse.backend.entity.StudentProfile;
import com.avsarverse.backend.repository.OpportunityRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class EligibilityService {

    private final RuleEvaluator ruleEvaluator;
    private final OpportunityRepository opportunityRepository;
    private final ProfileService profileService;

    public EligibilityService(RuleEvaluator ruleEvaluator,
                              OpportunityRepository opportunityRepository,
                              ProfileService profileService) {
        this.ruleEvaluator = ruleEvaluator;
        this.opportunityRepository = opportunityRepository;
        this.profileService = profileService;
    }

    public List<EligibilityResultDto> checkEligibility(StudentProfile student) {
        StudentProfile targetStudent = (student != null) ? student : profileService.getProfile();
        List<Opportunity> allOpportunities = opportunityRepository.findAll();

        return allOpportunities.stream()
                .map(op -> ruleEvaluator.evaluateOpportunity(op, targetStudent))
                .collect(Collectors.toList());
    }

    public EligibilityResultDto checkSingleOpportunity(Long opportunityId, StudentProfile student) {
        StudentProfile targetStudent = (student != null) ? student : profileService.getProfile();
        Opportunity op = opportunityRepository.findById(opportunityId)
                .orElseThrow(() -> new OpportunityService.NoSuchOpportunityException("Opportunity not found: " + opportunityId));
        return ruleEvaluator.evaluateOpportunity(op, targetStudent);
    }

    public SimulatorResponseDto simulateProfileOverrides(SimulatorRequestDto overrides) {
        StudentProfile current = profileService.getProfile();

        // Create simulated profile clone
        StudentProfile simulated = StudentProfile.builder()
                .id(current.getId())
                .name(current.getName())
                .course(overrides.getCourse() != null ? overrides.getCourse() : current.getCourse())
                .yearOfStudy(overrides.getYearOfStudy() != null ? overrides.getYearOfStudy() : current.getYearOfStudy())
                .age(overrides.getAge() != null ? overrides.getAge() : current.getAge())
                .state(overrides.getState() != null ? overrides.getState() : current.getState())
                .category(overrides.getCategory() != null ? overrides.getCategory() : current.getCategory())
                .familyIncome(overrides.getFamilyIncome() != null ? overrides.getFamilyIncome() : current.getFamilyIncome())
                .percentage(overrides.getPercentage() != null ? overrides.getPercentage() : current.getPercentage())
                .graduationYear(overrides.getGraduationYear() != null ? overrides.getGraduationYear() : current.getGraduationYear())
                .preferredLanguage(current.getPreferredLanguage())
                .completedDocuments(current.getCompletedDocuments())
                .savedOpportunityIds(current.getSavedOpportunityIds())
                .build();

        List<Opportunity> all = opportunityRepository.findAll();

        List<EligibilityResultDto> currentResults = all.stream()
                .map(op -> ruleEvaluator.evaluateOpportunity(op, current))
                .collect(Collectors.toList());

        List<EligibilityResultDto> simulatedResults = all.stream()
                .map(op -> ruleEvaluator.evaluateOpportunity(op, simulated))
                .collect(Collectors.toList());

        Map<Long, EligibilityResultDto> currentMap = currentResults.stream()
                .collect(Collectors.toMap(EligibilityResultDto::getOpportunityId, r -> r));

        List<OpportunityDiffDto> diffs = new ArrayList<>();
        int unlocked = 0;
        int lost = 0;

        for (EligibilityResultDto simRes : simulatedResults) {
            Long opId = simRes.getOpportunityId();
            EligibilityResultDto currRes = currentMap.get(opId);

            boolean prevElig = currRes != null && currRes.isEligible();
            boolean currElig = simRes.isEligible();

            if (!prevElig && currElig) {
                unlocked++;
                diffs.add(OpportunityDiffDto.builder()
                        .opportunityId(opId)
                        .title(simRes.getOpportunity().getTitle())
                        .type(simRes.getOpportunity().getType())
                        .previouslyEligible(false)
                        .currentlyEligible(true)
                        .changeType("UNLOCKED")
                        .reason("Unlocked: Newly meets all criteria with updated simulated profile.")
                        .build());
            } else if (prevElig && !currElig) {
                lost++;
                diffs.add(OpportunityDiffDto.builder()
                        .opportunityId(opId)
                        .title(simRes.getOpportunity().getTitle())
                        .type(simRes.getOpportunity().getType())
                        .previouslyEligible(true)
                        .currentlyEligible(false)
                        .changeType("LOST")
                        .reason("Lost: " + (simRes.getPrimaryGap() != null ? simRes.getPrimaryGap() : "No longer satisfies updated constraints."))
                        .build());
            }
        }

        int totalCurrEligible = (int) currentResults.stream().filter(EligibilityResultDto::isEligible).count();
        int totalSimEligible = (int) simulatedResults.stream().filter(EligibilityResultDto::isEligible).count();

        String summary = String.format("Simulation complete: %d new opportunity(s) unlocked, %d lost. Total eligible shifted from %d to %d.",
                unlocked, lost, totalCurrEligible, totalSimEligible);

        return SimulatorResponseDto.builder()
                .currentResults(currentResults)
                .simulatedResults(simulatedResults)
                .diffs(diffs)
                .unlockedCount(unlocked)
                .lostCount(lost)
                .totalCurrentEligible(totalCurrEligible)
                .totalSimulatedEligible(totalSimEligible)
                .summaryMessage(summary)
                .build();
    }
}
