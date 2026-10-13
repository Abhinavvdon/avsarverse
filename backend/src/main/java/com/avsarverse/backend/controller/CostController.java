package com.avsarverse.backend.controller;

import com.avsarverse.backend.dto.CostEstimateRequestDto;
import com.avsarverse.backend.dto.CostEstimateResponseDto;
import com.avsarverse.backend.service.CostService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/cost")
public class CostController {

    private final CostService costService;

    public CostController(CostService costService) {
        this.costService = costService;
    }

    @PostMapping("/estimate")
    public ResponseEntity<CostEstimateResponseDto> estimateCosts(
            @RequestBody(required = false) CostEstimateRequestDto request) {
        return ResponseEntity.ok(costService.estimateCosts(
                request != null ? request.getOpportunityIds() : null));
    }
}
