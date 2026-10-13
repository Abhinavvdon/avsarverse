package com.avsarverse.backend.controller;

import com.avsarverse.backend.dto.EligibilityResultDto;
import com.avsarverse.backend.entity.StudentProfile;
import com.avsarverse.backend.service.EligibilityService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/eligibility")
public class EligibilityController {

    private final EligibilityService eligibilityService;

    public EligibilityController(EligibilityService eligibilityService) {
        this.eligibilityService = eligibilityService;
    }

    @PostMapping("/check")
    public ResponseEntity<List<EligibilityResultDto>> checkEligibility(@RequestBody(required = false) StudentProfile studentProfile) {
        return ResponseEntity.ok(eligibilityService.checkEligibility(studentProfile));
    }

    @GetMapping("/check/{opportunityId}")
    public ResponseEntity<EligibilityResultDto> checkSingle(@PathVariable Long opportunityId) {
        return ResponseEntity.ok(eligibilityService.checkSingleOpportunity(opportunityId, null));
    }
}
