package com.avsarverse.backend.controller;

import com.avsarverse.backend.dto.AgeClockItemDto;
import com.avsarverse.backend.entity.Opportunity;
import com.avsarverse.backend.entity.OpportunityType;
import com.avsarverse.backend.entity.StudentProfile;
import com.avsarverse.backend.repository.OpportunityRepository;
import com.avsarverse.backend.service.ProfileService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/age-clock")
public class AgeClockController {

    private final OpportunityRepository opportunityRepository;
    private final ProfileService profileService;

    public AgeClockController(OpportunityRepository opportunityRepository, ProfileService profileService) {
        this.opportunityRepository = opportunityRepository;
        this.profileService = profileService;
    }

    @GetMapping
    public ResponseEntity<List<AgeClockItemDto>> getAgeClock() {
        StudentProfile profile = profileService.getProfile();
        int currentAge = profile.getAge() != null ? profile.getAge() : 21;
        int currentYear = LocalDate.now().getYear();
        int approxBirthYear = currentYear - currentAge;

        List<Opportunity> govtExams = opportunityRepository.findByType(OpportunityType.GOVT_EXAM);

        List<AgeClockItemDto> clockItems = govtExams.stream()
                .filter(op -> op.getMaxAge() != null)
                .map(op -> {
                    int maxAge = op.getMaxAge();
                    int ageLimitYear = approxBirthYear + maxAge;
                    int yearsRemaining = maxAge - currentAge;
                    int monthsRemaining = Math.max(0, yearsRemaining * 12);

                    Integer maxAttempts = op.getMaxAttempts();
                    Integer attemptsRemaining = maxAttempts != null ? maxAttempts : null;

                    String message;
                    String urgency;

                    if (yearsRemaining < 0) {
                        message = String.format("Aged Out: Maximum permissible age (%d yrs) exceeded by %d years.", maxAge, Math.abs(yearsRemaining));
                        urgency = "EXPIRED";
                    } else if (yearsRemaining <= 1) {
                        message = String.format("Last chance window! Final eligible year: %d (~%d months remaining).", ageLimitYear, monthsRemaining);
                        urgency = "CRITICAL";
                    } else if (yearsRemaining <= 3) {
                        message = String.format("Mid-window: Last eligible year: %d (%d years left).", ageLimitYear, yearsRemaining);
                        urgency = "MODERATE";
                    } else {
                        message = String.format("Long runway: Last eligible year: %d (%d years left).", ageLimitYear, yearsRemaining);
                        urgency = "RELAXED";
                    }

                    return AgeClockItemDto.builder()
                            .opportunityId(op.getId())
                            .title(op.getTitle())
                            .maxAge(maxAge)
                            .studentCurrentAge(currentAge)
                            .ageLimitYear(ageLimitYear)
                            .yearsRemaining(yearsRemaining)
                            .monthsRemaining(monthsRemaining)
                            .maxAttempts(maxAttempts)
                            .attemptsRemaining(attemptsRemaining)
                            .statusMessage(message)
                            .urgencyLevel(urgency)
                            .build();
                })
                .sorted((a, b) -> Integer.compare(a.getYearsRemaining(), b.getYearsRemaining()))
                .collect(Collectors.toList());

        return ResponseEntity.ok(clockItems);
    }
}
