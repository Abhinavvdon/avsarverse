package com.avsarverse.backend.service;

import com.avsarverse.backend.entity.Opportunity;
import com.avsarverse.backend.entity.StudentProfile;
import com.avsarverse.backend.repository.OpportunityRepository;
import com.avsarverse.backend.repository.StudentProfileRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class ProfileService {

    private final StudentProfileRepository profileRepository;
    private final OpportunityRepository opportunityRepository;

    public ProfileService(StudentProfileRepository profileRepository, OpportunityRepository opportunityRepository) {
        this.profileRepository = profileRepository;
        this.opportunityRepository = opportunityRepository;
    }

    @Transactional(readOnly = true)
    public StudentProfile getProfile() {
        return profileRepository.findById(1L)
                .orElseGet(this::createDefaultProfile);
    }

    @Transactional
    public StudentProfile updateProfile(StudentProfile updated) {
        StudentProfile existing = getProfile();
        existing.setName(updated.getName());
        existing.setCourse(updated.getCourse());
        existing.setYearOfStudy(updated.getYearOfStudy());
        existing.setAge(updated.getAge());
        existing.setState(updated.getState());
        existing.setCategory(updated.getCategory());
        existing.setFamilyIncome(updated.getFamilyIncome());
        existing.setPercentage(updated.getPercentage());
        existing.setGraduationYear(updated.getGraduationYear());
        existing.setPreferredLanguage(updated.getPreferredLanguage());
        if (updated.getCompletedDocuments() != null) {
            existing.setCompletedDocuments(new ArrayList<>(updated.getCompletedDocuments()));
        }
        return profileRepository.save(existing);
    }

    @Transactional
    public Set<Long> saveOpportunity(Long opportunityId) {
        StudentProfile profile = getProfile();
        profile.getSavedOpportunityIds().add(opportunityId);
        profileRepository.save(profile);
        return profile.getSavedOpportunityIds();
    }

    @Transactional
    public Set<Long> removeSavedOpportunity(Long opportunityId) {
        StudentProfile profile = getProfile();
        profile.getSavedOpportunityIds().remove(opportunityId);
        profileRepository.save(profile);
        return profile.getSavedOpportunityIds();
    }

    @Transactional(readOnly = true)
    public List<Opportunity> getSavedOpportunities() {
        StudentProfile profile = getProfile();
        Set<Long> ids = profile.getSavedOpportunityIds();
        if (ids == null || ids.isEmpty()) {
            return Collections.emptyList();
        }
        return opportunityRepository.findAllById(ids);
    }

    @Transactional
    public StudentProfile toggleDocumentCompletion(String docKey) {
        StudentProfile profile = getProfile();
        List<String> docs = profile.getCompletedDocuments();
        if (docs.contains(docKey)) {
            docs.remove(docKey);
        } else {
            docs.add(docKey);
        }
        return profileRepository.save(profile);
    }

    private StudentProfile createDefaultProfile() {
        StudentProfile profile = StudentProfile.builder()
                .id(1L)
                .name("Arjun Sharma")
                .course("B.Tech Computer Science")
                .yearOfStudy(4)
                .age(21)
                .state("Madhya Pradesh")
                .category("OBC")
                .familyIncome(280000.0) // 2.8 Lakhs
                .percentage(78.5)
                .graduationYear(2027)
                .preferredLanguage("en")
                .completedDocuments(new ArrayList<>(Arrays.asList("aadhaar", "marksheet_10", "marksheet_12", "domicile_mp")))
                .savedOpportunityIds(new HashSet<>())
                .build();
        return profileRepository.save(profile);
    }
}
