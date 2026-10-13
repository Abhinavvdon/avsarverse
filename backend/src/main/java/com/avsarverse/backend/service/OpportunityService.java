package com.avsarverse.backend.service;

import com.avsarverse.backend.entity.Opportunity;
import com.avsarverse.backend.entity.OpportunityType;
import com.avsarverse.backend.repository.OpportunityRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class OpportunityService {

    private final OpportunityRepository opportunityRepository;

    public OpportunityService(OpportunityRepository opportunityRepository) {
        this.opportunityRepository = opportunityRepository;
    }

    @Transactional(readOnly = true)
    public List<Opportunity> getOpportunities(OpportunityType type, String query) {
        if ((type == null) && (query == null || query.isBlank())) {
            return opportunityRepository.findAll();
        }
        return opportunityRepository.searchOpportunities(type, query != null ? query.trim() : null);
    }

    @Transactional(readOnly = true)
    public Opportunity getOpportunityById(Long id) {
        return opportunityRepository.findById(id)
                .orElseThrow(() -> new NoSuchOpportunityException("Opportunity with ID " + id + " not found"));
    }

    @Transactional
    public Opportunity reportOutdated(Long id) {
        Opportunity op = getOpportunityById(id);
        op.setIsOutdatedReports(op.getIsOutdatedReports() == null ? 1 : op.getIsOutdatedReports() + 1);
        return opportunityRepository.save(op);
    }

    @Transactional
    public Opportunity saveOpportunity(Opportunity opportunity) {
        return opportunityRepository.save(opportunity);
    }

    public static class NoSuchOpportunityException extends RuntimeException {
        public NoSuchOpportunityException(String message) {
            super(message);
        }
    }
}
