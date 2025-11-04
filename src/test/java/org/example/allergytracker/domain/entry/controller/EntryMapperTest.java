package org.example.allergytracker.domain.entry.controller;

import org.example.allergytracker.domain.entry.model.ExposureType;
import org.example.allergytracker.domain.entry.model.Entry;
import org.example.allergytracker.domain.entry.model.Note;
import org.example.allergytracker.domain.entry.model.Symptoms;
import org.junit.jupiter.api.Test;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import java.util.UUID;

import static org.example.allergytracker.domain.entry.controller.EntryMapper.fromDto;
import static org.example.allergytracker.domain.entry.controller.EntryMapper.toDto;
import static org.junit.jupiter.api.Assertions.*;

class EntryMapperTest {

  private static final UUID ENTRY_ID = UUID.randomUUID();
  private static final LocalDate ENTRY_DATE = LocalDate.of(2025, 11, 4);
  private static final int UPPER_RESPIRATORY = 2;
  private static final int LOWER_RESPIRATORY = 3;
  private static final int SKIN = 1;
  private static final int EYES = 4;
  private static final String NOTE_TEXT = "Test note";
  private static final ExposureType EXPOSURE_1 = new ExposureType(UUID.randomUUID(), "Cat", "Cat allergen");
  private static final ExposureType EXPOSURE_2 = new ExposureType(UUID.randomUUID(), "Dust", "Dust allergen");

  private static final Entry TEST_ENTRY = new Entry(
      ENTRY_ID,
      ENTRY_DATE,
      new Symptoms(UPPER_RESPIRATORY),
      new Symptoms(LOWER_RESPIRATORY),
      new Symptoms(SKIN),
      new Symptoms(EYES),
      new Note(NOTE_TEXT),
      Instant.now(),
      Instant.now(),
      List.of(EXPOSURE_1, EXPOSURE_2)
  );

  @Test
  void shouldMapToDtoCorrectly() {
    // When
    var actualDto = toDto(TEST_ENTRY);

    // Then
    assertEquals(ENTRY_ID, actualDto.id());
    assertEquals(ENTRY_DATE.atStartOfDay(ZoneId.systemDefault()).toInstant(), actualDto.occurredOn());
    assertEquals(UPPER_RESPIRATORY, actualDto.upperRespiratory());
    assertEquals(LOWER_RESPIRATORY, actualDto.lowerRespiratory());
    assertEquals(SKIN, actualDto.skin());
    assertEquals(EYES, actualDto.eyes());
    assertEquals(UPPER_RESPIRATORY + LOWER_RESPIRATORY + SKIN + EYES, actualDto.total());
    assertEquals(List.of("Cat", "Dust"), actualDto.exposures());
    assertEquals(NOTE_TEXT, actualDto.note());
  }

  @Test
  void shouldMapFromDtoCorrectly() {
    // Given
    var occurredOn = ENTRY_DATE.atStartOfDay(ZoneId.systemDefault()).toInstant();
    var dto = new EntryDto(
        ENTRY_ID,
        occurredOn,
        UPPER_RESPIRATORY,
        LOWER_RESPIRATORY,
        SKIN,
        EYES,
        UPPER_RESPIRATORY + LOWER_RESPIRATORY + SKIN + EYES,
        List.of("Cat", "Dust"),
        NOTE_TEXT
    );
    var exposureTypes = List.of(EXPOSURE_1, EXPOSURE_2);

    // When
    var actualEntry = fromDto(dto, exposureTypes);

    // Then
    assertEquals(ENTRY_ID, actualEntry.id());
    assertEquals(ENTRY_DATE, actualEntry.occuredOn());
    assertEquals(UPPER_RESPIRATORY, actualEntry.upperRespiratory().value());
    assertEquals(LOWER_RESPIRATORY, actualEntry.lowerRespiratory().value());
    assertEquals(SKIN, actualEntry.skin().value());
    assertEquals(EYES, actualEntry.eyes().value());
    assertEquals(NOTE_TEXT, actualEntry.note().value().orElse(null));
    assertEquals(exposureTypes, actualEntry.exposureTypes());
  }

  @Test
  void shouldMapExposureTypeToDtoCorrectly() {
    // When
    var actualDto = EntryMapper.toDto(EXPOSURE_1);

    // Then
    assertEquals(EXPOSURE_1.id(), actualDto.id());
    assertEquals("Cat", actualDto.name());
    assertEquals("Cat allergen", actualDto.description());
  }

  @Test
  void shouldMapExposureTypeFromDtoCorrectly() {
    // Given
    var dto = new ExposureTypeDto(EXPOSURE_1.id(), "Cat", "Cat allergen");

    // When
    var actualExposureType = EntryMapper.fromDto(dto);

    // Then
    assertEquals(EXPOSURE_1.id(), actualExposureType.id());
    assertEquals("Cat", actualExposureType.value());
    assertEquals("Cat allergen", actualExposureType.description());
  }

  @Test
  void shouldHandleNullNoteCorrectly() {
    // Given
    var entryWithNullNote = new Entry(
        ENTRY_ID,
        ENTRY_DATE,
        new Symptoms(UPPER_RESPIRATORY),
        new Symptoms(LOWER_RESPIRATORY),
        new Symptoms(SKIN),
        new Symptoms(EYES),
        new Note(null),
        Instant.now(),
        Instant.now(),
        List.of(EXPOSURE_1)
    );

    // When
    var actualDto = toDto(entryWithNullNote);

    // Then
    assertNull(actualDto.note());
  }
}