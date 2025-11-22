package org.example.allergytracker.domain.entry.model;

import jakarta.persistence.Embeddable;

@Embeddable
public record Symptoms(int value) { }
