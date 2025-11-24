package org.example.allergytracker.domain.entry.controller;

import org.example.allergytracker.domain.entry.model.Entry;
import org.example.allergytracker.domain.entry.model.ExposureType;
import org.example.allergytracker.domain.entry.model.Note;
import org.example.allergytracker.domain.entry.model.Symptoms;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Component
public class EntryMapper {

  public static EntryDto toDto(Entry entry) {
    var total = entry.upperRespiratory().value() +
            entry.lowerRespiratory().value() +
            entry.skin().value() +
            entry.eyes().value();

    var exposures = entry.exposureTypes().stream()
            .map(ExposureType::value)
            .toList();

    return new EntryDto(
            entry.id(),
            entry.user().id(),
            entry.occurredOn(),
            entry.upperRespiratory().value(),
            entry.lowerRespiratory().value(),
            entry.skin().value(),
            entry.eyes().value(),
            total,
            exposures,
            entry.note().map(Note::value).orElse(null)
    );
  }

  public static Entry fromDto(EntryDto dto, List<ExposureType> exposureTypes) {
    return new Entry(
            dto.id(),
            null,
            dto.occurredOn(),
            new Symptoms(dto.upperRespiratory()),
            new Symptoms(dto.lowerRespiratory()),
            new Symptoms(dto.skin()),
            new Symptoms(dto.eyes()),
            new Note(dto.note()),
            Instant.now(),
            Instant.now(),
            exposureTypes
    );
  }

  public static ExposureTypeDto toDto(ExposureType exposureType) {
    return new ExposureTypeDto(
            exposureType.id(),
            exposureType.value(),
            exposureType.description()
    );
  }

  public static ExposureType fromDto(ExposureTypeDto dto) {
    return new ExposureType(
            dto.id() != null ? dto.id() : UUID.randomUUID(),
            dto.name(),
            dto.description()
    );
  }
}
