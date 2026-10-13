package com.avsarverse.backend.controller;

import com.avsarverse.backend.entity.Opportunity;
import com.avsarverse.backend.service.ProfileService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/saved")
public class SavedOpportunityController {

    private final ProfileService profileService;

    public SavedOpportunityController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping
    public ResponseEntity<List<Opportunity>> getSavedOpportunities() {
        return ResponseEntity.ok(profileService.getSavedOpportunities());
    }

    @PostMapping("/{id}")
    public ResponseEntity<Set<Long>> saveOpportunity(@PathVariable Long id) {
        return ResponseEntity.ok(profileService.saveOpportunity(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Set<Long>> removeSavedOpportunity(@PathVariable Long id) {
        return ResponseEntity.ok(profileService.removeSavedOpportunity(id));
    }
}
