package com.avsarverse.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "student_profiles")
public class StudentProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String course;

    private Integer yearOfStudy;

    private Integer age;

    private String state;

    private String category; // General, OBC, SC, ST, EWS

    private Double familyIncome; // Annual INR

    private Double percentage;

    private Integer graduationYear;

    @Builder.Default
    private String preferredLanguage = "en"; // "en" or "hi"

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "student_completed_documents", joinColumns = @JoinColumn(name = "profile_id"))
    @Column(name = "doc_key")
    @Builder.Default
    private List<String> completedDocuments = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "student_saved_opportunities", joinColumns = @JoinColumn(name = "profile_id"))
    @Column(name = "opportunity_id")
    @Builder.Default
    private Set<Long> savedOpportunityIds = new HashSet<>();
}
