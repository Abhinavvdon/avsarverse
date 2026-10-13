package com.avsarverse.backend.controller;

import com.avsarverse.backend.entity.Opportunity;
import com.avsarverse.backend.entity.OpportunityType;
import com.avsarverse.backend.service.OpportunityService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/opportunities")
public class OpportunityController {

    private final OpportunityService opportunityService;

    public OpportunityController(OpportunityService opportunityService) {
        this.opportunityService = opportunityService;
    }

    @GetMapping
    public ResponseEntity<List<Opportunity>> getOpportunities(
            @RequestParam(required = false) OpportunityType type,
            @RequestParam(required = false) String q) {
        return ResponseEntity.ok(opportunityService.getOpportunities(type, q));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Opportunity> getOpportunityById(@PathVariable Long id) {
        return ResponseEntity.ok(opportunityService.getOpportunityById(id));
    }

    @PostMapping("/{id}/report-outdated")
    public ResponseEntity<Opportunity> reportOutdated(@PathVariable Long id) {
        return ResponseEntity.ok(opportunityService.reportOutdated(id));
    }
}
