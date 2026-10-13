package com.avsarverse.backend.service;

import com.avsarverse.backend.dto.DocumentChecklistDto;
import com.avsarverse.backend.dto.DocumentChecklistItemDto;
import com.avsarverse.backend.entity.Opportunity;
import com.avsarverse.backend.entity.RequiredDocument;
import com.avsarverse.backend.entity.StudentProfile;
import com.avsarverse.backend.repository.OpportunityRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Service
public class DocumentService {

    private final OpportunityRepository opportunityRepository;
    private final ProfileService profileService;

    public DocumentService(OpportunityRepository opportunityRepository, ProfileService profileService) {
        this.opportunityRepository = opportunityRepository;
        this.profileService = profileService;
    }

    public DocumentChecklistDto getDocumentChecklist(List<Long> opportunityIds) {
        StudentProfile student = profileService.getProfile();
        List<String> completedDocs = student.getCompletedDocuments() != null ?
                student.getCompletedDocuments() : Collections.emptyList();

        List<Opportunity> targets;
        if (opportunityIds != null && !opportunityIds.isEmpty()) {
            targets = opportunityRepository.findAllById(opportunityIds);
        } else if (student.getSavedOpportunityIds() != null && !student.getSavedOpportunityIds().isEmpty()) {
            targets = opportunityRepository.findAllById(student.getSavedOpportunityIds());
        } else {
            // Default to all opportunities
            targets = opportunityRepository.findAll();
        }

        LocalDate today = LocalDate.now();
        List<DocumentChecklistItemDto> items = new ArrayList<>();
        Set<String> processedKeys = new HashSet<>();

        for (Opportunity op : targets) {
            if (op.getRequiredDocuments() == null) continue;
            LocalDate deadline = op.getApplicationDeadline() != null ? op.getApplicationDeadline() : today.plusDays(30);

            for (RequiredDocument doc : op.getRequiredDocuments()) {
                String uniqueItemKey = op.getId() + "_" + doc.getKey();
                if (processedKeys.contains(uniqueItemKey)) continue;
                processedKeys.add(uniqueItemKey);

                boolean alreadyPossessed = completedDocs.stream().anyMatch(d -> d.equalsIgnoreCase(doc.getKey()));

                // startBy = deadline minus processingDays minus 3 days buffer
                LocalDate startByDate = deadline.minusDays(doc.getProcessingDays() + 3L);
                long daysUntilStartBy = ChronoUnit.DAYS.between(today, startByDate);

                boolean isUrgent = !alreadyPossessed && (startByDate.isBefore(today) || daysUntilStartBy <= 7);

                String status;
                if (alreadyPossessed) {
                    status = "READY";
                } else if (isUrgent) {
                    status = "URGENT";
                } else {
                    status = "ACTION_REQUIRED";
                }

                items.add(DocumentChecklistItemDto.builder()
                        .key(doc.getKey())
                        .label(doc.getLabel())
                        .opportunityId(op.getId())
                        .opportunityTitle(op.getTitle())
                        .alreadyPossessed(alreadyPossessed)
                        .processingDays(doc.getProcessingDays())
                        .deadline(deadline)
                        .startByDate(startByDate)
                        .daysUntilStartBy(daysUntilStartBy)
                        .isUrgent(isUrgent)
                        .status(status)
                        .build());
            }
        }

        // Sort: Urgent first, then by startByDate ascending, then ready items
        items.sort((a, b) -> {
            if (a.isUrgent() != b.isUrgent()) {
                return Boolean.compare(b.isUrgent(), a.isUrgent()); // true first
            }
            if (a.isAlreadyPossessed() != b.isAlreadyPossessed()) {
                return Boolean.compare(a.isAlreadyPossessed(), b.isAlreadyPossessed()); // false (unpossessed) first
            }
            return a.getStartByDate().compareTo(b.getStartByDate());
        });

        int urgentCount = (int) items.stream().filter(DocumentChecklistItemDto::isUrgent).count();
        int readyCount = (int) items.stream().filter(DocumentChecklistItemDto::isAlreadyPossessed).count();
        int pendingCount = items.size() - readyCount;

        return DocumentChecklistDto.builder()
                .items(items)
                .totalDocuments(items.size())
                .urgentCount(urgentCount)
                .readyCount(readyCount)
                .pendingCount(pendingCount)
                .build();
    }
}
