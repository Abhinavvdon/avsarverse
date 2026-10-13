package com.avsarverse.backend.controller;

import com.avsarverse.backend.dto.NoticeDraftDto;
import com.avsarverse.backend.dto.NoticeExtractRequestDto;
import com.avsarverse.backend.entity.Opportunity;
import com.avsarverse.backend.service.AiNoticeService;
import com.avsarverse.backend.service.OpportunityService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.ArrayList;

@RestController
@RequestMapping("/api/ai")
public class AiNoticeController {

    private final AiNoticeService aiNoticeService;
    private final OpportunityService opportunityService;

    public AiNoticeController(AiNoticeService aiNoticeService, OpportunityService opportunityService) {
        this.aiNoticeService = aiNoticeService;
        this.opportunityService = opportunityService;
    }

    @PostMapping("/extract-notice")
    public ResponseEntity<NoticeDraftDto> extractNotice(@RequestBody(required = false) NoticeExtractRequestDto request) {
        String text = (request != null) ? request.getNoticeText() : "";
        return ResponseEntity.ok(aiNoticeService.extractNotice(text));
    }

    @PostMapping("/save-draft")
    public ResponseEntity<Opportunity> saveDraft(@RequestBody NoticeDraftDto draft) {
        Opportunity op = Opportunity.builder()
                .title(draft.getTitle() != null ? draft.getTitle() : "Extracted Opportunity")
                .subtitle(draft.getSubtitle() != null ? draft.getSubtitle() : "AI Notice Extraction")
                .description(draft.getDescription() != null ? draft.getDescription() : "Opportunity drafted from official notice text.")
                .type(draft.getType())
                .sourceUrl(draft.getSourceUrl() != null ? draft.getSourceUrl() : "https://mp.gov.in")
                .lastVerified(LocalDate.now())
                .applicationDeadline(draft.getApplicationDeadline() != null ? draft.getApplicationDeadline() : LocalDate.now().plusMonths(2))
                .examDate(draft.getExamDate())
                .applicationFee(draft.getApplicationFee() != null ? draft.getApplicationFee() : 500.0)
                .exclusivityGroup(draft.getExclusivityGroup())
                .topicTags(draft.getTopicTags() != null ? new ArrayList<>(draft.getTopicTags()) : new ArrayList<>())
                .rules(draft.getRules() != null ? new ArrayList<>(draft.getRules()) : new ArrayList<>())
                .requiredDocuments(draft.getRequiredDocuments() != null ? new ArrayList<>(draft.getRequiredDocuments()) : new ArrayList<>())
                .maxAge(draft.getMaxAge())
                .maxAttempts(draft.getMaxAttempts())
                .estimatedTravelCost(draft.getEstimatedTravelCost() != null ? draft.getEstimatedTravelCost() : 1000.0)
                .feeWaiverCategories(draft.getFeeWaiverCategories() != null ? new ArrayList<>(draft.getFeeWaiverCategories()) : new ArrayList<>())
                .isOutdatedReports(0)
                .build();

        Opportunity saved = opportunityService.saveOpportunity(op);
        return ResponseEntity.ok(saved);
    }
}
