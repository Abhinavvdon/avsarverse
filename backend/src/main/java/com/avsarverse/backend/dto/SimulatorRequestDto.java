package com.avsarverse.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SimulatorRequestDto {
    private Double percentage;
    private Double familyIncome;
    private Integer age;
    private Integer graduationYear;
    private String category;
    private String state;
    private String course;
    private Integer yearOfStudy;
}
