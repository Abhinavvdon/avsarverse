package com.avsarverse.backend.service;

import com.avsarverse.backend.dto.BestPlanResponseDto;
import com.avsarverse.backend.dto.ConflictResponseDto;
import com.avsarverse.backend.engine.ConflictEngine;
import com.avsarverse.backend.engine.PlanOptimizer;
import com.avsarverse.backend.entity.Opportunity;
import com.avsarverse.backend.entity.StudentProfile;
import com.avsarverse.backend.repository.OpportunityRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Service
public class ConflictService {

    private final ConflictEngine conflictEngine;
    private final PlanOptimizer planOptimizer;
    private final OpportunityRepository opportunityRepository;
    private final ProfileService profileService;

    public ConflictService(ConflictEngine conflictEngine,
                           PlanOptimizer planOptimizer,
                           OpportunityRepository opportunityRepository,
                           ProfileService profileService) {
        this.conflictEngine = conflictEngine;
        this.planOptimizer = planOptimizer;
        this.opportunityRepository = opportunityRepository;
        this.profileService = profileService;
    }

    public ConflictResponseDto findConflicts(List<Long> opportunityIds) {
        List<Opportunity> targets = resolveTargets(opportunityIds);
        return conflictEngine.evaluateConflicts(targets);
    }

    public BestPlanResponseDto generateBestCombination(List<Long> opportunityIds, Integer maxPick) {
        List<Opportunity> targets = resolveTargets(opportunityIds);
        StudentProfile student = profileService.getProfile();
        int pickLimit = (maxPick != null && maxPick > 0) ? maxPick : 3;
        return planOptimizer.optimizePlan(targets, pickLimit, student);
    }

    private List<Opportunity> resolveTargets(List<Long> opportunityIds) {
        if (opportunityIds != null && !opportunityIds.isEmpty()) {
            return opportunityRepository.findAllById(opportunityIds);
        }

        StudentProfile profile = profileService.getProfile();
        Set<Long> savedIds = profile.getSavedOpportunityIds();
        if (savedIds != null && !savedIds.isEmpty()) {
            return opportunityRepository.findAllById(savedIds);
        }

        // Default fallback to first 6 opportunities for instant demo exploration
        List<Opportunity> all = opportunityRepository.findAll();
        return all.subList(0, Math.min(6, all.size()));
    }
}
