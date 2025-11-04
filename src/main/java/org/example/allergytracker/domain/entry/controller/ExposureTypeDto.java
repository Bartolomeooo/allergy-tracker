package org.example.allergytracker.domain.entry.controller;

import java.util.UUID;

public record ExposureTypeDto(
        UUID id,
        String name,
        String description
) {
}
