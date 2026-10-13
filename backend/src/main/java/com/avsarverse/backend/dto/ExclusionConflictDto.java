package com.avsarverse.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExclusionConflictDto {
    private String exclusivityGroup;
    private Long opportunity1Id;
    private String opportunity1Title;
    private Long opportunity2Id;
    private String opportunity2Title;
    private String explanation;
}
