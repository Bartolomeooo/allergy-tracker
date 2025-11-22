package org.example.allergytracker.domain.entry.controller;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record EntryDto(
        UUID id,
        UUID userId,
        Instant occurredOn,
        int upperRespiratory,
        int lowerRespiratory,
        int skin,
        int eyes,
        int total,
        List<String> exposures,
        String note
) {
    public EntryDto withId(UUID newId) {
        return new EntryDto(
                newId,
                this.userId,
                this.occurredOn,
                this.upperRespiratory,
                this.lowerRespiratory,
                this.skin,
                this.eyes,
                this.total,
                this.exposures,
                this.note
        );
    }
}
