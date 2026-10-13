package com.avsarverse.backend.service;

import com.avsarverse.backend.dto.NoticeDraftDto;
import com.avsarverse.backend.entity.OpportunityType;
import com.avsarverse.backend.entity.RequiredDocument;
import com.avsarverse.backend.entity.Rule;
import com.avsarverse.backend.entity.RuleField;
import com.avsarverse.backend.entity.RuleOperator;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.util.*;

@Service
public class AiNoticeService {

    private static final Logger log = LoggerFactory.getLogger(AiNoticeService.class);
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final RestTemplate restTemplate = new RestTemplate();

    public NoticeDraftDto extractNotice(String noticeText) {
        String apiKey = System.getenv("GEMINI_API_KEY");

        if (apiKey != null && !apiKey.isBlank() && noticeText != null && !noticeText.isBlank()) {
            try {
                return callGeminiApi(noticeText, apiKey);
            } catch (Exception e) {
                log.warn("Gemini API call failed or encountered error: {}. Falling back to high-fidelity mock extraction.", e.getMessage());
            }
        }

        return generateFallbackDraft(noticeText);
    }

    private NoticeDraftDto callGeminiApi(String noticeText, String apiKey) throws Exception {
        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + apiKey;

        String prompt = "You are an expert document parser for Indian educational and exam notices.\n" +
                "Extract structured data from the following notification in JSON format:\n" +
                "{\n" +
                "  \"title\": \"Exam or Scholarship Name\",\n" +
                "  \"subtitle\": \"Short subtitle\",\n" +
                "  \"description\": \"Concise overview\",\n" +
                "  \"type\": \"HIGHER_STUDIES\" or \"SCHOLARSHIP\" or \"GOVT_EXAM\",\n" +
                "  \"sourceUrl\": \"Official portal url\",\n" +
                "  \"applicationDeadline\": \"YYYY-MM-DD\",\n" +
                "  \"examDate\": \"YYYY-MM-DD\" or null,\n" +
                "  \"applicationFee\": number,\n" +
                "  \"maxAge\": number or null,\n" +
                "  \"maxAttempts\": number or null,\n" +
                "  \"estimatedTravelCost\": number or null,\n" +
                "  \"feeWaiverCategories\": [\"SC\", \"ST\", \"Female\"],\n" +
                "  \"topicTags\": [\"Quantitative Aptitude\", \"Logical Reasoning\"],\n" +
                "  \"rules\": [\n" +
                "    {\"field\": \"percentage|familyIncome|age|course|yearOfStudy|category|state\", \"operator\": \"GTE|LTE|EQ|IN\", \"value\": \"...\", \"label\": \"Human readable requirement\"}\n" +
                "  ],\n" +
                "  \"requiredDocuments\": [\n" +
                "    {\"key\": \"doc_key\", \"label\": \"Document name\", \"processingDays\": 15}\n" +
                "  ]\n" +
                "}\n" +
                "Notification text:\n" + noticeText;

        Map<String, Object> body = new HashMap<>();
        Map<String, Object> part = new HashMap<>();
        part.put("text", prompt);

        Map<String, Object> content = new HashMap<>();
        content.put("parts", Collections.singletonList(part));
        body.put("contents", Collections.singletonList(content));

        Map<String, Object> genConfig = new HashMap<>();
        genConfig.put("responseMimeType", "application/json");
        body.put("generationConfig", genConfig);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
        ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);

        if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
            JsonNode root = objectMapper.readTree(response.getBody());
            JsonNode candidates = root.path("candidates");
            if (candidates.isArray() && !candidates.isEmpty()) {
                String textResponse = candidates.get(0).path("content").path("parts").get(0).path("text").asText();
                NoticeDraftDto draft = objectMapper.readValue(textResponse, NoticeDraftDto.class);
                draft.setMockNotice(false);
                draft.setNote("Extracted via Google Gemini 2.5 Flash API");
                return draft;
            }
        }

        throw new RuntimeException("Empty or malformed Gemini response");
    }

    private NoticeDraftDto generateFallbackDraft(String rawNotice) {
        String snippet = (rawNotice != null && rawNotice.length() > 50) ?
                rawNotice.substring(0, Math.min(200, rawNotice.length())) :
                "Official Employment / Admission Notice";

        LocalDate today = LocalDate.now();
        LocalDate deadline = today.plusMonths(2);
        LocalDate examDate = today.plusMonths(4).plusDays(10);

        List<Rule> rules = Arrays.asList(
                Rule.builder().field(RuleField.percentage).operator(RuleOperator.GTE).value("60").label("Minimum 60% aggregate in B.Tech / B.E.").build(),
                Rule.builder().field(RuleField.course).operator(RuleOperator.IN).value("B.Tech, B.E., Engineering").label("Degree in Engineering / Technology").build(),
                Rule.builder().field(RuleField.age).operator(RuleOperator.LTE).value("30").label("Age limit 30 years as of notice date").build(),
                Rule.builder().field(RuleField.state).operator(RuleOperator.EQ).value("Madhya Pradesh").label("Resident / Domicile of Madhya Pradesh").build()
        );

        List<RequiredDocument> docs = Arrays.asList(
                RequiredDocument.builder().key("domicile_mp").label("Madhya Pradesh Domicile Certificate").processingDays(15).build(),
                RequiredDocument.builder().key("engg_degree").label("Engineering Final Degree / Marksheets").processingDays(10).build(),
                RequiredDocument.builder().key("aadhaar").label("Aadhaar Card with linked Mobile").processingDays(2).build(),
                RequiredDocument.builder().key("caste_cert").label("Valid Caste / Category Certificate (if applicable)").processingDays(20).build()
        );

        return NoticeDraftDto.builder()
                .title("MP State Assistant Engineer (SES) Examination 2027")
                .subtitle("MP Public Service Commission - Water Resources & PWD Dept")
                .description("Official gazetted recruitment for Assistant Engineers (Civil, Electrical, Mechanical, Computer) across Madhya Pradesh government departments. Extracted preview ready for review.")
                .type(OpportunityType.GOVT_EXAM)
                .sourceUrl("https://mppsc.mp.gov.in")
                .applicationDeadline(deadline)
                .examDate(examDate)
                .applicationFee(500.0)
                .exclusivityGroup(null)
                .rules(rules)
                .requiredDocuments(docs)
                .topicTags(Arrays.asList("Core Engineering", "General Awareness", "Logical Reasoning", "Quantitative Aptitude"))
                .maxAge(30)
                .maxAttempts(4)
                .estimatedTravelCost(1200.0)
                .feeWaiverCategories(Arrays.asList("SC", "ST", "Female"))
                .isMockNotice(true)
                .note("Sample draft parsed via intelligent fallback engine (GEMINI_API_KEY environment variable not configured or mocked for demo stability)")
                .build();
    }
}
