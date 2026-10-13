package com.avsarverse.backend.entity;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Embeddable
public class RequiredDocument {

    @jakarta.persistence.Column(name = "doc_key")
    private String key;

    private String label;

    private int processingDays;
}
