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
public class ConflictResponseDto {
    private List<DateClashDto> dateClashes;
    private List<ExclusionConflictDto> exclusionConflicts;
    private List<SharedPrepTopicDto> sharedPrep;
    private int totalClashes;
    private int totalExclusions;
    private int totalSharedTopics;
}
