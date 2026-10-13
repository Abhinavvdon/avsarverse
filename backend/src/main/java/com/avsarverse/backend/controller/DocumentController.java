package com.avsarverse.backend.controller;

import com.avsarverse.backend.dto.DocumentChecklistDto;
import com.avsarverse.backend.service.DocumentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/documents")
public class DocumentController {

    private final DocumentService documentService;

    public DocumentController(DocumentService documentService) {
        this.documentService = documentService;
    }

    @GetMapping("/checklist")
    public ResponseEntity<DocumentChecklistDto> getChecklist(
            @RequestParam(required = false) List<Long> opportunityIds) {
        return ResponseEntity.ok(documentService.getDocumentChecklist(opportunityIds));
    }
}
