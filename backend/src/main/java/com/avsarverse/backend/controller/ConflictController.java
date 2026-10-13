package com.avsarverse.backend.controller;

import com.avsarverse.backend.dto.ConflictRequestDto;
import com.avsarverse.backend.dto.ConflictResponseDto;
import com.avsarverse.backend.service.ConflictService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/conflicts")
public class ConflictController {

    private final ConflictService conflictService;

    public ConflictController(ConflictService conflictService) {
        this.conflictService = conflictService;
    }

    @PostMapping
    public ResponseEntity<ConflictResponseDto> detectConflicts(@RequestBody(required = false) ConflictRequestDto request) {
        return ResponseEntity.ok(conflictService.findConflicts(request != null ? request.getOpportunityIds() : null));
    }
}
