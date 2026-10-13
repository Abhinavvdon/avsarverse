package com.avsarverse.backend.controller;

import com.avsarverse.backend.dto.SimulatorRequestDto;
import com.avsarverse.backend.dto.SimulatorResponseDto;
import com.avsarverse.backend.service.EligibilityService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/simulator")
public class SimulatorController {

    private final EligibilityService eligibilityService;

    public SimulatorController(EligibilityService eligibilityService) {
        this.eligibilityService = eligibilityService;
    }

    @PostMapping
    public ResponseEntity<SimulatorResponseDto> runSimulator(@RequestBody SimulatorRequestDto overrides) {
        return ResponseEntity.ok(eligibilityService.simulateProfileOverrides(overrides));
    }
}
