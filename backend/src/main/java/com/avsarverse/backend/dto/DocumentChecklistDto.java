package com.avsarverse.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DocumentChecklistDto {
    private List<DocumentChecklistItemDto> items;
    private int totalDocuments;
    private int urgentCount;
    private int readyCount;
    private int pendingCount;
}
