package com.avsarverse.backend.bootstrap;

import com.avsarverse.backend.entity.*;
import com.avsarverse.backend.repository.OpportunityRepository;
import com.avsarverse.backend.repository.StudentProfileRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.*;

@Component
public class DataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

    private final StudentProfileRepository profileRepository;
    private final OpportunityRepository opportunityRepository;

    public DataSeeder(StudentProfileRepository profileRepository, OpportunityRepository opportunityRepository) {
        this.profileRepository = profileRepository;
        this.opportunityRepository = opportunityRepository;
    }

    @Override
    public void run(String... args) {
        seedStudentProfile();
        seedOpportunities();
    }

    private void seedStudentProfile() {
        if (profileRepository.count() == 0) {
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
                    .savedOpportunityIds(new HashSet<>(Arrays.asList(1L, 2L, 11L, 22L)))
                    .build();
            profileRepository.save(profile);
            log.info("Seeded initial StudentProfile: Arjun Sharma (id=1)");
        }
    }

    private void seedOpportunities() {
        if (opportunityRepository.count() > 0) {
            return;
        }

        LocalDate seedDate = LocalDate.now();
        List<Opportunity> list = new ArrayList<>();

        // =========================================================================
        // HIGHER STUDIES (~10)
        // =========================================================================

        // 1. GATE 2027
        list.add(Opportunity.builder()
                .type(OpportunityType.HIGHER_STUDIES)
                .title("GATE 2027 (Graduate Aptitude Test in Engineering)")
                .subtitle("IIT Guwahati / IISc National Engineering Entrance")
                .description("National examination for M.Tech admissions in IITs, IISc, NITs, and PSU recruitment across India. [Sample data – verify on official site]")
                .sourceUrl("https://gate2027.iitg.ac.in")
                .lastVerified(seedDate)
                .applicationDeadline(LocalDate.of(2026, 11, 20))
                .examDate(LocalDate.of(2027, 2, 7))
                .applicationFee(1800.0)
                .exclusivityGroup(null)
                .topicTags(Arrays.asList("Core Engineering", "Engineering Mathematics", "General Aptitude", "Logical Reasoning"))
                .requiredDocuments(Arrays.asList(
                        new RequiredDocument("aadhaar", "Aadhaar Card", 2),
                        new RequiredDocument("engg_marksheet", "Degree / Pre-final Year Marksheet", 10),
                        new RequiredDocument("category_cert", "Category / OBC-NCL Certificate", 20)
                ))
                .rules(Arrays.asList(
                        Rule.builder().field(RuleField.course).operator(RuleOperator.IN).value("B.Tech, B.E., Engineering").label("B.Tech / B.E. Degree enrolled or completed").build(),
                        Rule.builder().field(RuleField.yearOfStudy).operator(RuleOperator.GTE).value("3").label("Minimum 3rd year undergraduate standing").build()
                ))
                .maxAge(null)
                .maxAttempts(null)
                .estimatedTravelCost(1200.0)
                .feeWaiverCategories(Arrays.asList("SC", "ST", "Female"))
                .isOutdatedReports(0)
                .build());

        // 2. CAT 2026/2027 (Clashes with GATE deadline: 2026-11-18 vs 2026-11-20)
        list.add(Opportunity.builder()
                .type(OpportunityType.HIGHER_STUDIES)
                .title("CAT 2026/2027 (Common Admission Test)")
                .subtitle("Indian Institutes of Management (IIMs)")
                .description("Premier entrance exam for MBA/PGDM programs at 21 IIMs, FMS Delhi, SPJIMR, and top B-schools. [Sample data – verify on official site]")
                .sourceUrl("https://iimcat.ac.in")
                .lastVerified(seedDate)
                .applicationDeadline(LocalDate.of(2026, 11, 18))
                .examDate(LocalDate.of(2026, 11, 29))
                .applicationFee(2400.0)
                .exclusivityGroup(null)
                .topicTags(Arrays.asList("Quantitative Aptitude", "Data Interpretation", "Logical Reasoning", "Verbal Ability & English"))
                .requiredDocuments(Arrays.asList(
                        new RequiredDocument("aadhaar", "Aadhaar Card", 2),
                        new RequiredDocument("marksheet_10", "Class 10 Marksheet", 2),
                        new RequiredDocument("marksheet_12", "Class 12 Marksheet", 2),
                        new RequiredDocument("grad_marksheet", "Undergraduate Degree Marksheets", 10)
                ))
                .rules(Arrays.asList(
                        Rule.builder().field(RuleField.percentage).operator(RuleOperator.GTE).value("50").label("Minimum 50% aggregate marks in Bachelor's degree").build()
                ))
                .maxAge(null)
                .maxAttempts(null)
                .estimatedTravelCost(1500.0)
                .feeWaiverCategories(Arrays.asList("SC", "ST"))
                .isOutdatedReports(0)
                .build());

        // 3. IIIT Hyderabad PGEE 2027
        list.add(Opportunity.builder()
                .type(OpportunityType.HIGHER_STUDIES)
                .title("IIIT Hyderabad PGEE 2027")
                .subtitle("Post-Graduate Entrance Examination for M.Tech & MS Research")
                .description("Institutional entrance for high-caliber Computer Science, Artificial Intelligence, and VLSI postgraduate programs. [Sample data – verify on official site]")
                .sourceUrl("https://pgadmissions.iiit.ac.in")
                .lastVerified(seedDate)
                .applicationDeadline(LocalDate.of(2027, 3, 25))
                .examDate(LocalDate.of(2027, 4, 18))
                .applicationFee(2500.0)
                .exclusivityGroup(null)
                .topicTags(Arrays.asList("Core Engineering", "Computer Science Foundations", "Programming & Data Structures", "Mathematics"))
                .requiredDocuments(Arrays.asList(
                        new RequiredDocument("aadhaar", "Aadhaar Card", 2),
                        new RequiredDocument("engg_degree", "B.Tech Final Degree or Semester Transcripts", 10)
                ))
                .rules(Arrays.asList(
                        Rule.builder().field(RuleField.course).operator(RuleOperator.IN).value("B.Tech, B.E., Computer Science, IT, Electronics").label("Engineering degree in CS, IT, or related field").build(),
                        Rule.builder().field(RuleField.percentage).operator(RuleOperator.GTE).value("60").label("Minimum 60% in engineering degree").build()
                ))
                .maxAge(null)
                .maxAttempts(null)
                .estimatedTravelCost(2200.0)
                .feeWaiverCategories(new ArrayList<>())
                .isOutdatedReports(0)
                .build());

        // 4. BITS HD 2027
        list.add(Opportunity.builder()
                .type(OpportunityType.HIGHER_STUDIES)
                .title("BITS Higher Degree Admission (BITS HD) 2027")
                .subtitle("BITS Pilani / Goa / Hyderabad M.E. Programs")
                .description("Entrance test for Master of Engineering (Software Systems, Microelectronics, Design) across BITS campuses. [Sample data – verify on official site]")
                .sourceUrl("https://bitsadmission.com")
                .lastVerified(seedDate)
                .applicationDeadline(LocalDate.of(2027, 4, 20))
                .examDate(LocalDate.of(2027, 5, 24))
                .applicationFee(3400.0)
                .exclusivityGroup(null)
                .topicTags(Arrays.asList("Core Engineering", "Engineering Mathematics", "English"))
                .requiredDocuments(Arrays.asList(
                        new RequiredDocument("aadhaar", "Aadhaar Card", 2),
                        new RequiredDocument("grad_marksheet", "Graduation Marksheets", 10)
                ))
                .rules(Arrays.asList(
                        Rule.builder().field(RuleField.percentage).operator(RuleOperator.GTE).value("60").label("Minimum 60% in B.Tech / B.E.").build(),
                        Rule.builder().field(RuleField.course).operator(RuleOperator.IN).value("B.Tech, B.E., Engineering").label("Qualifying Bachelor's in Engineering").build()
                ))
                .maxAge(null)
                .maxAttempts(null)
                .estimatedTravelCost(1800.0)
                .feeWaiverCategories(new ArrayList<>())
                .isOutdatedReports(0)
                .build());

        // 5. IIT Bombay M.Tech (Research) Computer Science 2027
        list.add(Opportunity.builder()
                .type(OpportunityType.HIGHER_STUDIES)
                .title("IIT Bombay M.Tech RA (Research Assistantship) 2027")
                .subtitle("Department of Computer Science & Engineering")
                .description("3-year research-focused postgraduate program offering competitive monthly research fellowships and industry-scale labs. [Sample data – verify on official site]")
                .sourceUrl("https://www.cse.iitb.ac.in")
                .lastVerified(seedDate)
                .applicationDeadline(LocalDate.of(2027, 4, 12))
                .examDate(LocalDate.of(2027, 5, 10))
                .applicationFee(300.0)
                .exclusivityGroup(null)
                .topicTags(Arrays.asList("Core Engineering", "Algorithms", "Operating Systems", "Mathematics"))
                .requiredDocuments(Arrays.asList(
                        new RequiredDocument("gate_scorecard", "Valid GATE Scorecard", 5),
                        new RequiredDocument("sop", "Statement of Purpose", 7),
                        new RequiredDocument("aadhaar", "Aadhaar Card", 2)
                ))
                .rules(Arrays.asList(
                        Rule.builder().field(RuleField.percentage).operator(RuleOperator.GTE).value("70").label("Minimum 70% or 7.0 CGPA in B.Tech").build(),
                        Rule.builder().field(RuleField.course).operator(RuleOperator.IN).value("B.Tech, B.E., Computer Science").label("B.Tech in Computer Science / IT").build()
                ))
                .maxAge(null)
                .maxAttempts(null)
                .estimatedTravelCost(2500.0)
                .feeWaiverCategories(Arrays.asList("SC", "ST", "Female"))
                .isOutdatedReports(0)
                .build());

        // 6. TIFR GS 2027
        list.add(Opportunity.builder()
                .type(OpportunityType.HIGHER_STUDIES)
                .title("TIFR Graduate Studies (GS 2027)")
                .subtitle("Tata Institute of Fundamental Research - School of Technology")
                .description("Prestigious examination for Ph.D. and Integrated Ph.D. programs in Computer and Systems Sciences with full fellowship. [Sample data – verify on official site]")
                .sourceUrl("https://univ.tifr.res.in")
                .lastVerified(seedDate)
                .applicationDeadline(LocalDate.of(2026, 11, 10))
                .examDate(LocalDate.of(2026, 12, 13))
                .applicationFee(1000.0)
                .exclusivityGroup(null)
                .topicTags(Arrays.asList("Discrete Mathematics", "Algorithms", "Core Engineering", "Logical Reasoning"))
                .requiredDocuments(Arrays.asList(
                        new RequiredDocument("aadhaar", "Aadhaar Card", 2),
                        new RequiredDocument("grad_marksheet", "Degree / Semester Marksheets", 10)
                ))
                .rules(Arrays.asList(
                        Rule.builder().field(RuleField.percentage).operator(RuleOperator.GTE).value("60").label("Minimum 60% in undergraduate course").build()
                ))
                .maxAge(null)
                .maxAttempts(null)
                .estimatedTravelCost(1600.0)
                .feeWaiverCategories(Arrays.asList("Female"))
                .isOutdatedReports(0)
                .build());

        // 7. ISI Kolkata M.Tech Computer Science 2027
        list.add(Opportunity.builder()
                .type(OpportunityType.HIGHER_STUDIES)
                .title("ISI Kolkata M.Tech (Computer Science) 2027")
                .subtitle("Indian Statistical Institute PG Admissions")
                .description("Advanced 2-year curriculum in Theoretical Computer Science, Cryptography, and Machine Learning with monthly stipend. [Sample data – verify on official site]")
                .sourceUrl("https://isical.ac.in")
                .lastVerified(seedDate)
                .applicationDeadline(LocalDate.of(2027, 3, 10))
                .examDate(LocalDate.of(2027, 5, 9))
                .applicationFee(1250.0)
                .exclusivityGroup(null)
                .topicTags(Arrays.asList("Mathematics", "Core Engineering", "Data Structures", "Logical Reasoning"))
                .requiredDocuments(Arrays.asList(
                        new RequiredDocument("aadhaar", "Aadhaar Card", 2),
                        new RequiredDocument("marksheet_12", "Class 12 Marksheet with Math", 2),
                        new RequiredDocument("grad_marksheet", "B.Tech Marksheet", 10)
                ))
                .rules(Arrays.asList(
                        Rule.builder().field(RuleField.percentage).operator(RuleOperator.GTE).value("60").label("Minimum 60% in engineering / mathematical sciences").build()
                ))
                .maxAge(null)
                .maxAttempts(null)
                .estimatedTravelCost(2800.0)
                .feeWaiverCategories(Arrays.asList("SC", "ST", "EWS"))
                .isOutdatedReports(0)
                .build());

        // 8. BARC OCES/DGFS 2027
        list.add(Opportunity.builder()
                .type(OpportunityType.HIGHER_STUDIES)
                .title("BARC OCES/DGFS 2027 Trainee Scientific Officer")
                .subtitle("Bhabha Atomic Research Centre Training Schools")
                .description("One-year orientation course leading to appointment as Group A Scientific Officer in Department of Atomic Energy. [Sample data – verify on official site]")
                .sourceUrl("https://barconlineexam.com")
                .lastVerified(seedDate)
                .applicationDeadline(LocalDate.of(2027, 2, 15))
                .examDate(LocalDate.of(2027, 4, 5))
                .applicationFee(500.0)
                .exclusivityGroup(null)
                .topicTags(Arrays.asList("Core Engineering", "General Awareness"))
                .requiredDocuments(Arrays.asList(
                        new RequiredDocument("aadhaar", "Aadhaar Card", 2),
                        new RequiredDocument("engg_degree", "B.Tech Final Degree or Semester Marksheet", 10),
                        new RequiredDocument("caste_cert", "Central Caste Certificate", 15)
                ))
                .rules(Arrays.asList(
                        Rule.builder().field(RuleField.percentage).operator(RuleOperator.GTE).value("60").label("Minimum 60% aggregate in B.Tech").build(),
                        Rule.builder().field(RuleField.age).operator(RuleOperator.LTE).value("26").label("Age not exceeding 26 years").build(),
                        Rule.builder().field(RuleField.course).operator(RuleOperator.IN).value("B.Tech, B.E., Computer Science, Mechanical, Electrical").label("Eligible engineering discipline").build()
                ))
                .maxAge(26)
                .maxAttempts(null)
                .estimatedTravelCost(1400.0)
                .feeWaiverCategories(Arrays.asList("SC", "ST", "Female"))
                .isOutdatedReports(0)
                .build());

        // 9. NIMCET 2027
        list.add(Opportunity.builder()
                .type(OpportunityType.HIGHER_STUDIES)
                .title("NIMCET 2027 (NIT MCA Common Entrance Test)")
                .subtitle("National Institutes of Technology MCA Admissions")
                .description("National level entrance test for admission to Master of Computer Applications at NIT Agartala, Allahabad, Bhopal, etc. [Sample data – verify on official site]")
                .sourceUrl("https://nimcet.in")
                .lastVerified(seedDate)
                .applicationDeadline(LocalDate.of(2027, 4, 15))
                .examDate(LocalDate.of(2027, 6, 6))
                .applicationFee(2500.0)
                .exclusivityGroup(null)
                .topicTags(Arrays.asList("Mathematics", "Analytical Ability & Logical Reasoning", "Computer Awareness", "English"))
                .requiredDocuments(Arrays.asList(
                        new RequiredDocument("aadhaar", "Aadhaar Card", 2),
                        new RequiredDocument("grad_marksheet", "Degree Marksheets", 10)
                ))
                .rules(Arrays.asList(
                        Rule.builder().field(RuleField.percentage).operator(RuleOperator.GTE).value("60").label("Minimum 60% marks in graduation").build()
                ))
                .maxAge(null)
                .maxAttempts(null)
                .estimatedTravelCost(1200.0)
                .feeWaiverCategories(Arrays.asList("SC", "ST"))
                .isOutdatedReports(0)
                .build());

        // 10. DA-IICT M.Tech (ICT & Data Science) 2027
        list.add(Opportunity.builder()
                .type(OpportunityType.HIGHER_STUDIES)
                .title("DA-IICT M.Tech (ICT & Data Science) 2027")
                .subtitle("Dhirubhai Ambani Institute of ICT Gandhinagar")
                .description("Specialized masters curriculum in Big Data, Distributed Systems, and Modern AI Architectures. [Sample data – verify on official site]")
                .sourceUrl("https://daiict.ac.in")
                .lastVerified(seedDate)
                .applicationDeadline(LocalDate.of(2027, 5, 15))
                .examDate(null)
                .applicationFee(1200.0)
                .exclusivityGroup(null)
                .topicTags(Arrays.asList("Core Engineering", "Mathematics"))
                .requiredDocuments(Arrays.asList(
                        new RequiredDocument("aadhaar", "Aadhaar Card", 2),
                        new RequiredDocument("grad_marksheet", "B.Tech Marksheets", 10)
                ))
                .rules(Arrays.asList(
                        Rule.builder().field(RuleField.percentage).operator(RuleOperator.GTE).value("60").label("Minimum 60% in B.Tech / B.E.").build(),
                        Rule.builder().field(RuleField.course).operator(RuleOperator.IN).value("B.Tech, B.E., Engineering").label("Engineering degree").build()
                ))
                .maxAge(null)
                .maxAttempts(null)
                .estimatedTravelCost(800.0)
                .feeWaiverCategories(new ArrayList<>())
                .isOutdatedReports(0)
                .build());

        // =========================================================================
        // SCHOLARSHIPS (~10)
        // =========================================================================

        // 11. MP MMVY Scholarship 2026-27 (Exclusivity Group 1)
        list.add(Opportunity.builder()
                .type(OpportunityType.SCHOLARSHIP)
                .title("MP Mukhya Mantri Medhavi Vidyarthi Yojana (MMVY) 2026-27")
                .subtitle("MP State Higher Education Dept 100% Tuition Fee Reimbursement")
                .description("Flagship MP government scheme paying entire institutional fee for meritorious MP students studying engineering. [Sample data – verify on official site]")
                .sourceUrl("https://scholarshipportal.mp.nic.in")
                .lastVerified(seedDate)
                .applicationDeadline(LocalDate.of(2026, 12, 30))
                .examDate(null)
                .applicationFee(0.0)
                .exclusivityGroup("MP_STATE_MERIT_OR_CENTRAL_SCHOLARSHIP")
                .topicTags(Arrays.asList("Academic Merit", "State Domicile"))
                .requiredDocuments(Arrays.asList(
                        new RequiredDocument("domicile_mp", "Madhya Pradesh Domicile Certificate", 15),
                        new RequiredDocument("income_cert", "Income Certificate (Tehsildar issued)", 15),
                        new RequiredDocument("marksheet_12", "Class 12 Board Marksheet", 2),
                        new RequiredDocument("samagra_id", "MP Samagra Social Security ID", 7),
                        new RequiredDocument("aadhaar", "Aadhaar Card", 2)
                ))
                .rules(Arrays.asList(
                        Rule.builder().field(RuleField.state).operator(RuleOperator.EQ).value("Madhya Pradesh").label("Permanent resident of Madhya Pradesh").build(),
                        Rule.builder().field(RuleField.percentage).operator(RuleOperator.GTE).value("70").label("Minimum 70% in Class 12 board examination").build(),
                        Rule.builder().field(RuleField.familyIncome).operator(RuleOperator.LTE).value("600000").label("Annual family income must not exceed ₹6,00,000").build()
                ))
                .maxAge(null)
                .maxAttempts(null)
                .estimatedTravelCost(0.0)
                .feeWaiverCategories(Arrays.asList("All"))
                .isOutdatedReports(0)
                .build());

        // 12. Central Sector Scholarship (CSSS) 2026-27 (Clashes with MMVY deadline & Exclusivity Group 1)
        list.add(Opportunity.builder()
                .type(OpportunityType.SCHOLARSHIP)
                .title("Central Sector Scheme of Scholarship (CSSS) 2026-27")
                .subtitle("Ministry of Education, Govt. of India (National Scholarship Portal)")
                .description("Direct financial assistance of ₹20,000/year for undergraduate students enrolled in regular degree programs. [Sample data – verify on official site]")
                .sourceUrl("https://scholarships.gov.in")
                .lastVerified(seedDate)
                .applicationDeadline(LocalDate.of(2026, 12, 31))
                .examDate(null)
                .applicationFee(0.0)
                .exclusivityGroup("MP_STATE_MERIT_OR_CENTRAL_SCHOLARSHIP")
                .topicTags(Arrays.asList("Academic Merit", "National Scholarship"))
                .requiredDocuments(Arrays.asList(
                        new RequiredDocument("income_cert", "Income Certificate (< 6 months old)", 15),
                        new RequiredDocument("marksheet_12", "Class 12 Marksheet", 2),
                        new RequiredDocument("bank_passbook", "Aadhaar Seeded Bank Account Details", 5),
                        new RequiredDocument("aadhaar", "Aadhaar Card", 2)
                ))
                .rules(Arrays.asList(
                        Rule.builder().field(RuleField.percentage).operator(RuleOperator.GTE).value("80").label("Above 80th percentile in relevant stream in Class 12").build(),
                        Rule.builder().field(RuleField.familyIncome).operator(RuleOperator.LTE).value("450000").label("Annual family income ceiling ₹4,50,000").build()
                ))
                .maxAge(null)
                .maxAttempts(null)
                .estimatedTravelCost(0.0)
                .feeWaiverCategories(Arrays.asList("All"))
                .isOutdatedReports(0)
                .build());

        // 13. MP Post-Matric Scholarship for OBC Students 2026-27 (Exclusivity Group 1)
        list.add(Opportunity.builder()
                .type(OpportunityType.SCHOLARSHIP)
                .title("MP Post-Matric Scholarship for OBC Students 2026-27")
                .subtitle("MP Backward Classes Welfare Department")
                .description("State maintenance allowance and fee reimbursement for backward class students studying in technical colleges. [Sample data – verify on official site]")
                .sourceUrl("https://scholarshipportal.mp.nic.in")
                .lastVerified(seedDate)
                .applicationDeadline(LocalDate.of(2027, 1, 15))
                .examDate(null)
                .applicationFee(0.0)
                .exclusivityGroup("MP_STATE_MERIT_OR_CENTRAL_SCHOLARSHIP")
                .topicTags(Arrays.asList("State Welfare", "Social Category"))
                .requiredDocuments(Arrays.asList(
                        new RequiredDocument("caste_cert", "MP Digital Caste Certificate (OBC)", 15),
                        new RequiredDocument("income_cert", "Income Certificate (≤ ₹3 Lakhs)", 15),
                        new RequiredDocument("domicile_mp", "MP Domicile Certificate", 15),
                        new RequiredDocument("samagra_id", "Samagra Member ID", 7),
                        new RequiredDocument("aadhaar", "Aadhaar Card", 2)
                ))
                .rules(Arrays.asList(
                        Rule.builder().field(RuleField.state).operator(RuleOperator.EQ).value("Madhya Pradesh").label("Resident of Madhya Pradesh").build(),
                        Rule.builder().field(RuleField.category).operator(RuleOperator.IN).value("OBC").label("Belongs to Other Backward Classes (OBC)").build(),
                        Rule.builder().field(RuleField.familyIncome).operator(RuleOperator.LTE).value("300000").label("Annual family income ≤ ₹3,00,000").build()
                ))
                .maxAge(null)
                .maxAttempts(null)
                .estimatedTravelCost(0.0)
                .feeWaiverCategories(Arrays.asList("All"))
                .isOutdatedReports(0)
                .build());

        // 14. MP Post-Matric Scholarship for SC/ST Students 2026-27 (Exclusivity Group 1)
        list.add(Opportunity.builder()
                .type(OpportunityType.SCHOLARSHIP)
                .title("MP Post-Matric Scholarship for SC/ST Students 2026-27")
                .subtitle("MP Tribal Affairs & Scheduled Castes Welfare Department")
                .description("Comprehensive tuition and monthly maintenance allowance for SC and ST students in recognized universities. [Sample data – verify on official site]")
                .sourceUrl("https://scholarshipportal.mp.nic.in")
                .lastVerified(seedDate)
                .applicationDeadline(LocalDate.of(2027, 1, 20))
                .examDate(null)
                .applicationFee(0.0)
                .exclusivityGroup("MP_STATE_MERIT_OR_CENTRAL_SCHOLARSHIP")
                .topicTags(Arrays.asList("State Welfare", "Social Category"))
                .requiredDocuments(Arrays.asList(
                        new RequiredDocument("caste_cert", "MP Digital Caste Certificate (SC/ST)", 15),
                        new RequiredDocument("income_cert", "Income Certificate (≤ ₹6 Lakhs)", 15),
                        new RequiredDocument("domicile_mp", "MP Domicile Certificate", 15),
                        new RequiredDocument("samagra_id", "Samagra Member ID", 7)
                ))
                .rules(Arrays.asList(
                        Rule.builder().field(RuleField.state).operator(RuleOperator.EQ).value("Madhya Pradesh").label("Resident of Madhya Pradesh").build(),
                        Rule.builder().field(RuleField.category).operator(RuleOperator.IN).value("SC, ST").label("Belongs to Scheduled Caste (SC) or Scheduled Tribe (ST)").build(),
                        Rule.builder().field(RuleField.familyIncome).operator(RuleOperator.LTE).value("600000").label("Annual family income ≤ ₹6,00,000").build()
                ))
                .maxAge(null)
                .maxAttempts(null)
                .estimatedTravelCost(0.0)
                .feeWaiverCategories(Arrays.asList("All"))
                .isOutdatedReports(0)
                .build());

        // 15. AICTE PG Scholarship for GATE Qualified Students 2026-27 (Exclusivity Group 2)
        list.add(Opportunity.builder()
                .type(OpportunityType.SCHOLARSHIP)
                .title("AICTE PG Scholarship for GATE Students 2026-27")
                .subtitle("All India Council for Technical Education (₹12,400/month)")
                .description("Monthly scholarship granted to full-time GATE qualified students admitted into AICTE-approved engineering institutions. [Sample data – verify on official site]")
                .sourceUrl("https://www.aicte-india.org")
                .lastVerified(seedDate)
                .applicationDeadline(LocalDate.of(2027, 2, 28))
                .examDate(null)
                .applicationFee(0.0)
                .exclusivityGroup("AICTE_CENTRAL_STIPEND_SCHEME")
                .topicTags(Arrays.asList("Core Engineering", "Research Aptitude"))
                .requiredDocuments(Arrays.asList(
                        new RequiredDocument("gate_scorecard", "Valid GATE Scorecard", 5),
                        new RequiredDocument("bank_passbook", "Bank Account Passbook (Single name)", 5),
                        new RequiredDocument("aadhaar", "Aadhaar Card", 2)
                ))
                .rules(Arrays.asList(
                        Rule.builder().field(RuleField.course).operator(RuleOperator.IN).value("B.Tech, B.E., Engineering").label("Graduated in B.Tech / B.E.").build(),
                        Rule.builder().field(RuleField.percentage).operator(RuleOperator.GTE).value("60").label("Minimum 60% in engineering degree").build()
                ))
                .maxAge(null)
                .maxAttempts(null)
                .estimatedTravelCost(0.0)
                .feeWaiverCategories(Arrays.asList("All"))
                .isOutdatedReports(0)
                .build());

        // 16. AICTE National Doctoral / PG Special Fellowship 2027 (Clashes with AICTE PG Scholarship: deadline 1 day apart & Exclusivity Group 2)
        list.add(Opportunity.builder()
                .type(OpportunityType.SCHOLARSHIP)
                .title("AICTE PG Special Fellowship 2027")
                .subtitle("Ministry of Education Advanced Research Fellowship")
                .description("Specialized research stipend for top engineering graduates pursuing master's or doctoral work in thrust technologies. [Sample data – verify on official site]")
                .sourceUrl("https://www.aicte-india.org")
                .lastVerified(seedDate)
                .applicationDeadline(LocalDate.of(2027, 3, 1))
                .examDate(null)
                .applicationFee(0.0)
                .exclusivityGroup("AICTE_CENTRAL_STIPEND_SCHEME")
                .topicTags(Arrays.asList("Core Engineering", "Research Aptitude"))
                .requiredDocuments(Arrays.asList(
                        new RequiredDocument("recommendation_letter", "Faculty Letter of Recommendation", 10),
                        new RequiredDocument("marksheet_12", "Class 12 Marksheet", 2),
                        new RequiredDocument("aadhaar", "Aadhaar Card", 2)
                ))
                .rules(Arrays.asList(
                        Rule.builder().field(RuleField.percentage).operator(RuleOperator.GTE).value("75").label("Minimum 75% aggregate marks in B.Tech / B.E.").build(),
                        Rule.builder().field(RuleField.course).operator(RuleOperator.IN).value("B.Tech, B.E., Engineering").label("Engineering graduate").build()
                ))
                .maxAge(null)
                .maxAttempts(null)
                .estimatedTravelCost(0.0)
                .feeWaiverCategories(Arrays.asList("All"))
                .isOutdatedReports(0)
                .build());

        // 17. AICTE Pragati Scholarship for Girl Students 2026-27
        list.add(Opportunity.builder()
                .type(OpportunityType.SCHOLARSHIP)
                .title("AICTE Pragati Scholarship for Girl Students 2026-27")
                .subtitle("Technical Education Grant for Women Empowerment (₹50,000/yr)")
                .description("Financial assistance towards college fees, purchase of books, equipment and stationery for girl students admitted to technical degree courses. [Sample data – verify on official site]")
                .sourceUrl("https://www.aicte-pragati-saksham-gov.in")
                .lastVerified(seedDate)
                .applicationDeadline(LocalDate.of(2026, 12, 15))
                .examDate(null)
                .applicationFee(0.0)
                .exclusivityGroup(null)
                .topicTags(Arrays.asList("Women Empowerment", "Technical Education"))
                .requiredDocuments(Arrays.asList(
                        new RequiredDocument("income_cert", "Family Income Certificate (≤ ₹8 Lakhs)", 15),
                        new RequiredDocument("bonafide_cert", "Institute Bonafide Certificate", 7),
                        new RequiredDocument("aadhaar", "Aadhaar Card", 2)
                ))
                .rules(Arrays.asList(
                        Rule.builder().field(RuleField.familyIncome).operator(RuleOperator.LTE).value("800000").label("Annual family income not exceeding ₹8,00,000").build(),
                        Rule.builder().field(RuleField.course).operator(RuleOperator.IN).value("B.Tech, B.E., Engineering").label("Enrolled in technical degree course").build(),
                        Rule.builder().field(RuleField.percentage).operator(RuleOperator.GTE).value("60").label("Minimum 60% in qualifying board examination").build()
                ))
                .maxAge(null)
                .maxAttempts(null)
                .estimatedTravelCost(0.0)
                .feeWaiverCategories(Arrays.asList("All"))
                .isOutdatedReports(0)
                .build());

        // 18. AICTE Saksham Scholarship 2026-27
        list.add(Opportunity.builder()
                .type(OpportunityType.SCHOLARSHIP)
                .title("AICTE Saksham Scholarship Scheme 2026-27")
                .subtitle("Empowering Specially-Abled Technical Students (₹50,000/yr)")
                .description("Annual assistance to specially-abled students with disability not less than 40% pursuing technical degrees. [Sample data – verify on official site]")
                .sourceUrl("https://www.aicte-pragati-saksham-gov.in")
                .lastVerified(seedDate)
                .applicationDeadline(LocalDate.of(2026, 12, 15))
                .examDate(null)
                .applicationFee(0.0)
                .exclusivityGroup(null)
                .topicTags(Arrays.asList("Differently Abled Support", "Technical Education"))
                .requiredDocuments(Arrays.asList(
                        new RequiredDocument("disability_cert", "Disability Certificate (Min 40%)", 15),
                        new RequiredDocument("income_cert", "Income Certificate (≤ ₹8 Lakhs)", 15),
                        new RequiredDocument("aadhaar", "Aadhaar Card", 2)
                ))
                .rules(Arrays.asList(
                        Rule.builder().field(RuleField.familyIncome).operator(RuleOperator.LTE).value("800000").label("Annual family income not exceeding ₹8,00,000").build(),
                        Rule.builder().field(RuleField.course).operator(RuleOperator.IN).value("B.Tech, B.E., Engineering").label("Technical degree enrollment").build()
                ))
                .maxAge(null)
                .maxAttempts(null)
                .estimatedTravelCost(0.0)
                .feeWaiverCategories(Arrays.asList("All"))
                .isOutdatedReports(0)
                .build());

        // 19. Siemens Scholarship Program for Engineering Students 2026-27
        list.add(Opportunity.builder()
                .type(OpportunityType.SCHOLARSHIP)
                .title("Siemens Scholarship Program for Engineering Students")
                .subtitle("Corporate Social Responsibility Engineering Grant")
                .description("Covers college tuition, provides textbook allowances, personal laptop, and comprehensive corporate internship training. [Sample data – verify on official site]")
                .sourceUrl("https://www.siemens.com/in/scholarship")
                .lastVerified(seedDate)
                .applicationDeadline(LocalDate.of(2026, 11, 25))
                .examDate(null)
                .applicationFee(0.0)
                .exclusivityGroup(null)
                .topicTags(Arrays.asList("Industry Mentorship", "Engineering Education"))
                .requiredDocuments(Arrays.asList(
                        new RequiredDocument("income_cert", "Family Income Certificate (≤ ₹2 Lakhs)", 15),
                        new RequiredDocument("marksheet_12", "Class 12 Marksheet", 2),
                        new RequiredDocument("admission_letter", "College Allotment Letter", 5)
                ))
                .rules(Arrays.asList(
                        Rule.builder().field(RuleField.course).operator(RuleOperator.IN).value("B.Tech, B.E., Engineering").label("First year student of B.Tech/B.E.").build(),
                        Rule.builder().field(RuleField.yearOfStudy).operator(RuleOperator.LTE).value("1").label("Must be in 1st year of study").build(),
                        Rule.builder().field(RuleField.familyIncome).operator(RuleOperator.LTE).value("200000").label("Family income must not exceed ₹2,00,000").build(),
                        Rule.builder().field(RuleField.percentage).operator(RuleOperator.GTE).value("60").label("Minimum 60% in Class 12 board").build()
                ))
                .maxAge(null)
                .maxAttempts(null)
                .estimatedTravelCost(0.0)
                .feeWaiverCategories(Arrays.asList("All"))
                .isOutdatedReports(0)
                .build());

        // 20. FAEA Scholarship 2026-27
        list.add(Opportunity.builder()
                .type(OpportunityType.SCHOLARSHIP)
                .title("FAEA Merit-Cum-Means Scholarship 2026-27")
                .subtitle("Foundation for Academic Excellence & Access")
                .description("Full financial sponsorship for disadvantaged and economically weaker section students pursuing technical degrees. [Sample data – verify on official site]")
                .sourceUrl("https://www.faeaindia.org")
                .lastVerified(seedDate)
                .applicationDeadline(LocalDate.of(2027, 1, 31))
                .examDate(null)
                .applicationFee(0.0)
                .exclusivityGroup(null)
                .topicTags(Arrays.asList("Economic Assistance", "Academic Merit"))
                .requiredDocuments(Arrays.asList(
                        new RequiredDocument("income_cert", "Income Certificate (≤ ₹3 Lakhs)", 15),
                        new RequiredDocument("bpl_card", "BPL Ration Card (if applicable)", 10),
                        new RequiredDocument("marksheet_12", "Class 12 Marksheet", 2),
                        new RequiredDocument("aadhaar", "Aadhaar Card", 2)
                ))
                .rules(Arrays.asList(
                        Rule.builder().field(RuleField.familyIncome).operator(RuleOperator.LTE).value("300000").label("Family income not exceeding ₹3,00,000").build(),
                        Rule.builder().field(RuleField.percentage).operator(RuleOperator.GTE).value("70").label("Minimum 70% in Class 12").build()
                ))
                .maxAge(null)
                .maxAttempts(null)
                .estimatedTravelCost(0.0)
                .feeWaiverCategories(Arrays.asList("All"))
                .isOutdatedReports(0)
                .build());

        // =========================================================================
        // GOVT EXAMS (~10)
        // =========================================================================

        // 21. SSC CGL 2027
        list.add(Opportunity.builder()
                .type(OpportunityType.GOVT_EXAM)
                .title("SSC CGL 2027 (Combined Graduate Level)")
                .subtitle("Staff Selection Commission - Central Ministries Group B & C")
                .description("National recruitment for Assistant Section Officer, Inspector (GST/IT), Sub-Inspector in CBI, and Auditor posts. [Sample data – verify on official site]")
                .sourceUrl("https://ssc.gov.in")
                .lastVerified(seedDate)
                .applicationDeadline(LocalDate.of(2027, 5, 10))
                .examDate(LocalDate.of(2027, 7, 12))
                .applicationFee(100.0)
                .exclusivityGroup(null)
                .topicTags(Arrays.asList("Quantitative Aptitude", "Logical Reasoning", "General Awareness", "English Comprehension"))
                .requiredDocuments(Arrays.asList(
                        new RequiredDocument("aadhaar", "Aadhaar Card", 2),
                        new RequiredDocument("marksheet_10", "Class 10 Certificate for DOB", 2),
                        new RequiredDocument("grad_marksheet", "Graduation Marksheet", 10)
                ))
                .rules(Arrays.asList(
                        Rule.builder().field(RuleField.age).operator(RuleOperator.LTE).value("32").label("Maximum age limit 32 years").build(),
                        Rule.builder().field(RuleField.course).operator(RuleOperator.IN).value("Any Graduate, B.Tech, B.E., B.Sc, B.Com, B.A.").label("Bachelor's Degree in any discipline").build()
                ))
                .maxAge(32)
                .maxAttempts(8)
                .estimatedTravelCost(800.0)
                .feeWaiverCategories(Arrays.asList("SC", "ST", "Female", "ESM"))
                .isOutdatedReports(0)
                .build());

        // 22. IBPS PO 2027 (Exam date 2027-10-17, clashes with SBI PO 2027-10-18: 1 day apart!)
        list.add(Opportunity.builder()
                .type(OpportunityType.GOVT_EXAM)
                .title("IBPS PO 2027 (Probationary Officer)")
                .subtitle("Scale-I Officers across 11 Public Sector Banks")
                .description("Joint recruitment for probationary officers in Bank of Baroda, Canara Bank, PNB, Union Bank of India. [Sample data – verify on official site]")
                .sourceUrl("https://ibps.in")
                .lastVerified(seedDate)
                .applicationDeadline(LocalDate.of(2027, 8, 20))
                .examDate(LocalDate.of(2027, 10, 17))
                .applicationFee(850.0)
                .exclusivityGroup(null)
                .topicTags(Arrays.asList("Quantitative Aptitude", "Logical Reasoning", "English Comprehension", "General Awareness", "Banking Awareness"))
                .requiredDocuments(Arrays.asList(
                        new RequiredDocument("aadhaar", "Aadhaar Card", 2),
                        new RequiredDocument("caste_cert", "Category Certificate (if claiming quota)", 15),
                        new RequiredDocument("grad_marksheet", "Degree Certificate / Marksheets", 10)
                ))
                .rules(Arrays.asList(
                        Rule.builder().field(RuleField.age).operator(RuleOperator.LTE).value("30").label("Maximum age limit 30 years").build(),
                        Rule.builder().field(RuleField.percentage).operator(RuleOperator.GTE).value("60").label("Minimum 60% in Bachelor's degree").build()
                ))
                .maxAge(30)
                .maxAttempts(null)
                .estimatedTravelCost(1000.0)
                .feeWaiverCategories(Arrays.asList("SC", "ST"))
                .isOutdatedReports(0)
                .build());

        // 23. SBI PO 2027 (Exam date 2027-10-18: EXACTLY 1 DAY AFTER IBPS PO 2027-10-17! HIGH CLASH)
        list.add(Opportunity.builder()
                .type(OpportunityType.GOVT_EXAM)
                .title("SBI PO 2027 (Probationary Officer)")
                .subtitle("State Bank of India Junior Management Grade Scale-I")
                .description("Premier banking career opportunity offering rapid promotions and senior leadership fast-track in SBI. [Sample data – verify on official site]")
                .sourceUrl("https://sbi.co.in/careers")
                .lastVerified(seedDate)
                .applicationDeadline(LocalDate.of(2027, 8, 25))
                .examDate(LocalDate.of(2027, 10, 18))
                .applicationFee(750.0)
                .exclusivityGroup(null)
                .topicTags(Arrays.asList("Quantitative Aptitude", "Logical Reasoning", "English Comprehension", "General Awareness", "Banking Awareness"))
                .requiredDocuments(Arrays.asList(
                        new RequiredDocument("aadhaar", "Aadhaar Card", 2),
                        new RequiredDocument("caste_cert", "OBC / SC / ST / EWS Certificate", 15),
                        new RequiredDocument("grad_marksheet", "Graduation Degree Marksheet", 10)
                ))
                .rules(Arrays.asList(
                        Rule.builder().field(RuleField.age).operator(RuleOperator.LTE).value("30").label("Maximum age limit 30 years").build(),
                        Rule.builder().field(RuleField.percentage).operator(RuleOperator.GTE).value("60").label("Minimum 60% aggregate in graduation").build()
                ))
                .maxAge(30)
                .maxAttempts(4)
                .estimatedTravelCost(1200.0)
                .feeWaiverCategories(Arrays.asList("SC", "ST"))
                .isOutdatedReports(0)
                .build());

        // 24. UPSC CSE 2027 (Prelims 2027-05-23: EXACT SAME DAY AS MPPSC 2027-05-23! CRITICAL CLASH)
        list.add(Opportunity.builder()
                .type(OpportunityType.GOVT_EXAM)
                .title("UPSC Civil Services Examination (CSE) 2027")
                .subtitle("Union Public Service Commission - IAS, IPS, IFS, IRS")
                .description("The most prestigious administrative examination in India recruiting leaders for civil services. [Sample data – verify on official site]")
                .sourceUrl("https://upsc.gov.in")
                .lastVerified(seedDate)
                .applicationDeadline(LocalDate.of(2027, 2, 20))
                .examDate(LocalDate.of(2027, 5, 23))
                .applicationFee(100.0)
                .exclusivityGroup(null)
                .topicTags(Arrays.asList("General Awareness", "Logical Reasoning", "Quantitative Aptitude", "English Comprehension", "Indian Polity", "History & Geography"))
                .requiredDocuments(Arrays.asList(
                        new RequiredDocument("aadhaar", "Aadhaar Card", 2),
                        new RequiredDocument("grad_marksheet", "Degree / Graduation Marksheet", 10),
                        new RequiredDocument("caste_cert", "Category Certificate (OBC/SC/ST/EWS)", 15)
                ))
                .rules(Arrays.asList(
                        Rule.builder().field(RuleField.age).operator(RuleOperator.LTE).value("32").label("Maximum age limit 32 years (General category)").build(),
                        Rule.builder().field(RuleField.course).operator(RuleOperator.IN).value("Any Graduate, B.Tech, B.E., B.Sc, B.Com, B.A.").label("Graduation degree in any subject").build()
                ))
                .maxAge(32)
                .maxAttempts(6)
                .estimatedTravelCost(1500.0)
                .feeWaiverCategories(Arrays.asList("SC", "ST", "Female"))
                .isOutdatedReports(0)
                .build());

        // 25. MPPSC State Services 2027 (Prelims 2027-05-23: EXACT SAME DAY AS UPSC CSE! CRITICAL COLLISION)
        list.add(Opportunity.builder()
                .type(OpportunityType.GOVT_EXAM)
                .title("MPPSC State Services Examination (SSE) 2027")
                .subtitle("Madhya Pradesh Public Service Commission - Deputy Collector / DSP")
                .description("Premier state administrative service examination selecting Group A & B officers for Madhya Pradesh. [Sample data – verify on official site]")
                .sourceUrl("https://mppsc.mp.gov.in")
                .lastVerified(seedDate)
                .applicationDeadline(LocalDate.of(2027, 2, 18))
                .examDate(LocalDate.of(2027, 5, 23))
                .applicationFee(500.0)
                .exclusivityGroup(null)
                .topicTags(Arrays.asList("General Awareness", "Madhya Pradesh GK & History", "Logical Reasoning", "Quantitative Aptitude", "General Hindi"))
                .requiredDocuments(Arrays.asList(
                        new RequiredDocument("domicile_mp", "MP Domicile Certificate", 15),
                        new RequiredDocument("mp_employment_portal_reg", "MP Employment Portal (Rojgar Panjiyan) Registration", 2),
                        new RequiredDocument("aadhaar", "Aadhaar Card", 2),
                        new RequiredDocument("grad_marksheet", "Degree Certificate", 10)
                ))
                .rules(Arrays.asList(
                        Rule.builder().field(RuleField.state).operator(RuleOperator.EQ).value("Madhya Pradesh").label("Domicile of Madhya Pradesh").build(),
                        Rule.builder().field(RuleField.age).operator(RuleOperator.LTE).value("40").label("Maximum age limit 40 years for MP state domiciled candidates").build(),
                        Rule.builder().field(RuleField.course).operator(RuleOperator.IN).value("Any Graduate, B.Tech, B.E., B.Sc, B.Com").label("Graduate in any discipline").build()
                ))
                .maxAge(40)
                .maxAttempts(null)
                .estimatedTravelCost(900.0)
                .feeWaiverCategories(Arrays.asList("SC", "ST", "OBC"))
                .isOutdatedReports(0)
                .build());

        // 26. MP Vyapam Sub-Engineer 2027
        list.add(Opportunity.builder()
                .type(OpportunityType.GOVT_EXAM)
                .title("MP Vyapam (ESB) Sub-Engineer Recruitment 2027")
                .subtitle("MP Employees Selection Board - PWD & WRD Junior Engineer")
                .description("State technical recruitment for Assistant & Sub-Engineers (Civil, Electrical, Mechanical, Computer) in MP departments. [Sample data – verify on official site]")
                .sourceUrl("https://esb.mp.gov.in")
                .lastVerified(seedDate)
                .applicationDeadline(LocalDate.of(2027, 3, 30))
                .examDate(LocalDate.of(2027, 6, 14))
                .applicationFee(500.0)
                .exclusivityGroup(null)
                .topicTags(Arrays.asList("Core Engineering", "General Awareness", "Logical Reasoning", "Quantitative Aptitude", "General Hindi"))
                .requiredDocuments(Arrays.asList(
                        new RequiredDocument("domicile_mp", "MP Domicile Certificate", 15),
                        new RequiredDocument("mp_employment_portal_reg", "Rojgar Panjiyan Registration", 2),
                        new RequiredDocument("engg_marksheet", "Engineering Degree / Diploma Marksheets", 10),
                        new RequiredDocument("aadhaar", "Aadhaar Card", 2)
                ))
                .rules(Arrays.asList(
                        Rule.builder().field(RuleField.state).operator(RuleOperator.EQ).value("Madhya Pradesh").label("Madhya Pradesh resident").build(),
                        Rule.builder().field(RuleField.course).operator(RuleOperator.IN).value("B.Tech, B.E., Diploma Engineering, Engineering").label("Degree or Diploma in Engineering").build(),
                        Rule.builder().field(RuleField.age).operator(RuleOperator.LTE).value("40").label("Age within 40 years").build()
                ))
                .maxAge(40)
                .maxAttempts(null)
                .estimatedTravelCost(600.0)
                .feeWaiverCategories(Arrays.asList("SC", "ST", "OBC"))
                .isOutdatedReports(0)
                .build());

        // 27. RRB NTPC 2027
        list.add(Opportunity.builder()
                .type(OpportunityType.GOVT_EXAM)
                .title("RRB NTPC (Non-Technical Popular Categories) 2027")
                .subtitle("Railway Recruitment Boards - Station Master, Goods Guard")
                .description("Central recruitment across Indian Railway zones for operational, station, and traffic managerial cadre. [Sample data – verify on official site]")
                .sourceUrl("https://rrbcdg.gov.in")
                .lastVerified(seedDate)
                .applicationDeadline(LocalDate.of(2027, 4, 30))
                .examDate(LocalDate.of(2027, 7, 25))
                .applicationFee(500.0)
                .exclusivityGroup(null)
                .topicTags(Arrays.asList("General Awareness", "Quantitative Aptitude", "Logical Reasoning"))
                .requiredDocuments(Arrays.asList(
                        new RequiredDocument("aadhaar", "Aadhaar Card", 2),
                        new RequiredDocument("marksheet_10", "Class 10 Certificate", 2),
                        new RequiredDocument("grad_marksheet", "Graduation Marksheet", 10)
                ))
                .rules(Arrays.asList(
                        Rule.builder().field(RuleField.age).operator(RuleOperator.LTE).value("33").label("Age limit 33 years").build(),
                        Rule.builder().field(RuleField.course).operator(RuleOperator.IN).value("Any Graduate, B.Tech, B.E., B.Sc").label("Graduation degree").build()
                ))
                .maxAge(33)
                .maxAttempts(null)
                .estimatedTravelCost(800.0)
                .feeWaiverCategories(Arrays.asList("SC", "ST", "Female", "EWS"))
                .isOutdatedReports(0)
                .build());

        // 28. ISRO Scientist/Engineer 'SC' 2027
        list.add(Opportunity.builder()
                .type(OpportunityType.GOVT_EXAM)
                .title("ISRO Scientist / Engineer 'SC' (CSE/ECE) 2027")
                .subtitle("Indian Space Research Organisation (ICRB)")
                .description("Prestigious R&D engineering positions at URSC, VSSC, and SAC centers supporting space missions and satellite launches. [Sample data – verify on official site]")
                .sourceUrl("https://isro.gov.in/careers")
                .lastVerified(seedDate)
                .applicationDeadline(LocalDate.of(2027, 1, 25))
                .examDate(LocalDate.of(2027, 3, 21))
                .applicationFee(250.0)
                .exclusivityGroup(null)
                .topicTags(Arrays.asList("Core Engineering", "Engineering Mathematics", "General Aptitude"))
                .requiredDocuments(Arrays.asList(
                        new RequiredDocument("engg_degree", "B.Tech Final Degree or Semester Marksheets", 10),
                        new RequiredDocument("aadhaar", "Aadhaar Card", 2),
                        new RequiredDocument("category_cert", "Category Certificate", 15)
                ))
                .rules(Arrays.asList(
                        Rule.builder().field(RuleField.percentage).operator(RuleOperator.GTE).value("65").label("Minimum 65% aggregate or 6.84 CGPA in B.Tech").build(),
                        Rule.builder().field(RuleField.age).operator(RuleOperator.LTE).value("28").label("Age must not exceed 28 years").build(),
                        Rule.builder().field(RuleField.course).operator(RuleOperator.IN).value("B.Tech, B.E., Computer Science, Engineering").label("First class degree in Computer Science / Engineering").build()
                ))
                .maxAge(28)
                .maxAttempts(null)
                .estimatedTravelCost(1800.0)
                .feeWaiverCategories(Arrays.asList("SC", "ST", "Female"))
                .isOutdatedReports(0)
                .build());

        // 29. DRDO CEPTAM-11 Senior Technical Assistant (STA-B) 2027 (Clashes with ISRO deadline: 2027-01-28 vs 2027-01-25 - 3 days)
        list.add(Opportunity.builder()
                .type(OpportunityType.GOVT_EXAM)
                .title("DRDO CEPTAM-11 Senior Technical Assistant (STA-B) 2027")
                .subtitle("Defence Research & Development Organisation Technical Cadre")
                .description("Defence lab technical officer positions in electronic warfare, missile systems, and cybersecurity infrastructure. [Sample data – verify on official site]")
                .sourceUrl("https://drdo.gov.in")
                .lastVerified(seedDate)
                .applicationDeadline(LocalDate.of(2027, 1, 28))
                .examDate(LocalDate.of(2027, 4, 10))
                .applicationFee(100.0)
                .exclusivityGroup(null)
                .topicTags(Arrays.asList("Core Engineering", "Quantitative Aptitude", "Logical Reasoning", "General Awareness"))
                .requiredDocuments(Arrays.asList(
                        new RequiredDocument("engg_marksheet", "Degree / Diploma Certificate", 10),
                        new RequiredDocument("aadhaar", "Aadhaar Card", 2),
                        new RequiredDocument("caste_cert", "Central Caste Certificate", 15)
                ))
                .rules(Arrays.asList(
                        Rule.builder().field(RuleField.percentage).operator(RuleOperator.GTE).value("60").label("Minimum 60% in engineering degree").build(),
                        Rule.builder().field(RuleField.age).operator(RuleOperator.LTE).value("28").label("Maximum age limit 28 years").build(),
                        Rule.builder().field(RuleField.course).operator(RuleOperator.IN).value("B.Tech, B.E., Computer Science, Electronics, Engineering").label("Recognized degree in Engineering").build()
                ))
                .maxAge(28)
                .maxAttempts(null)
                .estimatedTravelCost(1200.0)
                .feeWaiverCategories(Arrays.asList("SC", "ST", "Female", "ESM"))
                .isOutdatedReports(0)
                .build());

        // 30. AAI Junior Executive 2027
        list.add(Opportunity.builder()
                .type(OpportunityType.GOVT_EXAM)
                .title("AAI Junior Executive (Air Traffic Control) 2027")
                .subtitle("Airports Authority of India - Aviation & Engineering Operations")
                .description("Direct recruitment of engineers into national airspace radar management, ATC radar control, and avionics. [Sample data – verify on official site]")
                .sourceUrl("https://aai.aero")
                .lastVerified(seedDate)
                .applicationDeadline(LocalDate.of(2027, 3, 15))
                .examDate(LocalDate.of(2027, 5, 18))
                .applicationFee(1000.0)
                .exclusivityGroup(null)
                .topicTags(Arrays.asList("Physics & Mathematics", "Quantitative Aptitude", "Logical Reasoning", "English Comprehension", "General Awareness"))
                .requiredDocuments(Arrays.asList(
                        new RequiredDocument("aadhaar", "Aadhaar Card", 2),
                        new RequiredDocument("grad_marksheet", "Degree Marksheets", 10),
                        new RequiredDocument("passport_photo", "Recent Passport Photograph", 1)
                ))
                .rules(Arrays.asList(
                        Rule.builder().field(RuleField.percentage).operator(RuleOperator.GTE).value("60").label("Minimum 60% in engineering degree").build(),
                        Rule.builder().field(RuleField.age).operator(RuleOperator.LTE).value("27").label("Maximum age limit 27 years").build(),
                        Rule.builder().field(RuleField.course).operator(RuleOperator.IN).value("B.Tech, B.E., Engineering, B.Sc Physics").label("B.Tech or B.Sc with Physics and Mathematics").build()
                ))
                .maxAge(27)
                .maxAttempts(null)
                .estimatedTravelCost(1400.0)
                .feeWaiverCategories(Arrays.asList("SC", "ST", "Female"))
                .isOutdatedReports(0)
                .build());

        opportunityRepository.saveAll(list);
        log.info("Successfully seeded {} opportunities across HIGHER_STUDIES, SCHOLARSHIP, and GOVT_EXAM with realistic dates and clash conditions.", list.size());
    }
}
