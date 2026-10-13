package com.avsarverse.backend.entity;

import jakarta.persistence.Embeddable;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Embeddable
public class Rule {

    @Enumerated(EnumType.STRING)
    private RuleField field;

    @Enumerated(EnumType.STRING)
    private RuleOperator operator;

    @jakarta.persistence.Column(name = "rule_val")
    private String value;

    private String label;
}
