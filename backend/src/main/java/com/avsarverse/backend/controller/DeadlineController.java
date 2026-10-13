package com.avsarverse.backend.controller;

import com.avsarverse.backend.dto.DeadlineDto;
import com.avsarverse.backend.entity.Opportunity;
import com.avsarverse.backend.repository.OpportunityRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/deadlines")
public class DeadlineController {

    private final OpportunityRepository opportunityRepository;

    public DeadlineController(OpportunityRepository opportunityRepository) {
        this.opportunityRepository = opportunityRepository;
    }

    @GetMapping
    public ResponseEntity<List<DeadlineDto>> getUpcomingDeadlines() {
        LocalDate today = LocalDate.now();
        List<Opportunity> all = opportunityRepository.findAll();

        List<DeadlineDto> deadlines = all.stream()
                .filter(op -> op.getApplicationDeadline() != null)
                .map(op -> {
                    long daysLeft = ChronoUnit.DAYS.between(today, op.getApplicationDeadline());
                    boolean expired = daysLeft < 0;

                    String urgency;
                    String urgencyColor;

                    if (expired) {
                        urgency = "EXPIRED";
                        urgencyColor = "GRAY";
                    } else if (daysLeft <= 7) {
                        urgency = "CRITICAL";
                        urgencyColor = "RED";
                    } else if (daysLeft <= 30) {
                        urgency = "HIGH";
                        urgencyColor = "YELLOW";
                    } else {
                        urgency = "NORMAL";
                        urgencyColor = "GREEN";
                    }

                    return DeadlineDto.builder()
                            .opportunityId(op.getId())
                            .title(op.getTitle())
                            .type(op.getType())
                            .applicationDeadline(op.getApplicationDeadline())
                            .examDate(op.getExamDate())
                            .daysLeft(daysLeft)
                            .urgency(urgency)
                            .urgencyColor(urgencyColor)
                            .isExpired(expired)
                            .build();
                })
                .sorted((a, b) -> {
                    if (a.isExpired() != b.isExpired()) {
                        return Boolean.compare(a.isExpired(), b.isExpired()); // non-expired first
                    }
                    return Long.compare(a.getDaysLeft(), b.getDaysLeft());
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(deadlines);
    }
}
