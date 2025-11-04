package org.example.allergytracker.domain.entry.controller;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record EntryDto(
        UUID id,
        Instant occurredOn,
        int upperRespiratory,
        int lowerRespiratory,
        int skin,
        int eyes,
        int total,
        List<String> exposures,
        String note
) {
}
