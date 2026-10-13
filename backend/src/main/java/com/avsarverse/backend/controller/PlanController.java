package com.avsarverse.backend.controller;

import com.avsarverse.backend.dto.BestPlanRequestDto;
import com.avsarverse.backend.dto.BestPlanResponseDto;
import com.avsarverse.backend.service.ConflictService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/plan")
public class PlanController {

    private final ConflictService conflictService;

    public PlanController(ConflictService conflictService) {
        this.conflictService = conflictService;
    }

    @PostMapping("/best-combination")
    public ResponseEntity<BestPlanResponseDto> getBestCombination(@RequestBody(required = false) BestPlanRequestDto request) {
        return ResponseEntity.ok(conflictService.generateBestCombination(
                request != null ? request.getOpportunityIds() : null,
                request != null ? request.getMaxPick() : 3
        ));
    }
}
