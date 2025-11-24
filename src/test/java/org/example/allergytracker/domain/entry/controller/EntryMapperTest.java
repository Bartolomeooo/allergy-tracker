package org.example.allergytracker.domain.entry.controller;

import org.example.allergytracker.domain.entry.model.Entry;
import org.example.allergytracker.domain.entry.model.ExposureType;
import org.example.allergytracker.domain.entry.model.Note;
import org.example.allergytracker.domain.entry.model.Symptoms;
import org.example.allergytracker.domain.user.model.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import static org.example.allergytracker.domain.entry.controller.EntryMapper.fromDto;
import static org.example.allergytracker.domain.entry.controller.EntryMapper.toDto;
import static org.junit.jupiter.api.Assertions.*;

class EntryMapperTest {

  private static final UUID ENTRY_ID = UUID.randomUUID();
  private static final Instant ENTRY_INSTANT = Instant.parse("2025-11-04T10:15:30Z");
  private static final int UPPER_RESPIRATORY = 2;
  private static final int LOWER_RESPIRATORY = 3;
  private static final int SKIN = 1;
  private static final int EYES = 4;
  private static final String NOTE_TEXT = "Test note";
  private static final ExposureType EXPOSURE_1 = new ExposureType(UUID.randomUUID(), "Cat", "Cat allergen");
  private static final ExposureType EXPOSURE_2 = new ExposureType(UUID.randomUUID(), "Dust", "Dust allergen");

  private User testUser;
  private Entry testEntry;

  @BeforeEach
  void setUp() {
    testUser = new User();
    testUser.id(UUID.randomUUID());
    testUser.email("test@example.com");
    testUser.password("encodedPassword");

    testEntry = new Entry(
            ENTRY_ID,
            testUser,
            ENTRY_INSTANT,
            new Symptoms(UPPER_RESPIRATORY),
            new Symptoms(LOWER_RESPIRATORY),
            new Symptoms(SKIN),
            new Symptoms(EYES),
            new Note(NOTE_TEXT),
            Instant.now(),
            Instant.now(),
            List.of(EXPOSURE_1, EXPOSURE_2)
    );
  }

  @Test
  void shouldMapToDtoCorrectly() {
    // When
    var actualDto = toDto(testEntry);

    // Then
    assertEquals(ENTRY_ID, actualDto.id());
    assertEquals(testUser.id(), actualDto.userId());
    assertEquals(ENTRY_INSTANT, actualDto.occurredOn());
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
    var dto = new EntryDto(
        ENTRY_ID,
            testUser.id(),
            ENTRY_INSTANT,
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
    assertEquals(ENTRY_INSTANT, actualEntry.occurredOn());
    assertEquals(UPPER_RESPIRATORY, actualEntry.upperRespiratory().value());
    assertEquals(LOWER_RESPIRATORY, actualEntry.lowerRespiratory().value());
    assertEquals(SKIN, actualEntry.skin().value());
    assertEquals(EYES, actualEntry.eyes().value());
    assertEquals(NOTE_TEXT, actualEntry.note().map(Note::value).orElse(null));
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
            testUser,
            ENTRY_INSTANT,
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

  @Test
  void shouldCalculateTotalCorrectly() {
    // Given - all zeros
    var entryAllZeros = new Entry(
        ENTRY_ID,
            testUser,
            ENTRY_INSTANT,
        new Symptoms(0),
        new Symptoms(0),
        new Symptoms(0),
        new Symptoms(0),
        new Note(null),
        Instant.now(),
        Instant.now(),
        List.of()
    );

    // When
    var dto = toDto(entryAllZeros);

    // Then
    assertEquals(0, dto.total());
  }

  @Test
  void shouldCalculateTotalForMaxValues() {
    // Given - max values (assuming max is 10 per symptom)
    var entryMaxValues = new Entry(
        ENTRY_ID,
            testUser,
            ENTRY_INSTANT,
        new Symptoms(10),
        new Symptoms(10),
        new Symptoms(10),
        new Symptoms(10),
        new Note(null),
        Instant.now(),
        Instant.now(),
        List.of()
    );

    // When
    var dto = toDto(entryMaxValues);

    // Then
    assertEquals(40, dto.total());
  }

  @Test
  void shouldHandleEmptyExposuresList() {
    // Given
    var entryNoExposures = new Entry(
        ENTRY_ID,
            testUser,
            ENTRY_INSTANT,
        new Symptoms(1),
        new Symptoms(1),
        new Symptoms(1),
        new Symptoms(1),
        new Note("Note"),
        Instant.now(),
        Instant.now(),
        List.of()
    );

    // When
    var dto = toDto(entryNoExposures);

    // Then
    assertNotNull(dto.exposures());
    assertTrue(dto.exposures().isEmpty());
  }

  @Test
  void shouldGenerateUUIDWhenDtoIdIsNull() {
    // Given
    var dto = new EntryDto(
        null, // no ID
            testUser.id(),
            ENTRY_INSTANT,
        1, 1, 1, 1, 4,
        List.of(),
        "Note"
    );

    // When
    var entry = fromDto(dto, List.of());

    // Then
    assertNull(entry.id()); // ID should be null, Hibernate will generate it
  }

  @Test
  void shouldPreserveUUIDWhenDtoIdIsProvided() {
    // Given
    var customId = UUID.randomUUID();
    var dto = new EntryDto(
        customId,
            testUser.id(),
            ENTRY_INSTANT,
        1, 1, 1, 1, 4,
        List.of(),
        "Note"
    );

    // When
    var entry = fromDto(dto, List.of());

    // Then
    assertEquals(customId, entry.id());
  }

  @Test
  void shouldConvertTimestampCorrectly() {
    // Given
    var specificInstant = Instant.parse("2025-11-04T10:15:30.00Z");

    var dto = new EntryDto(
        ENTRY_ID,
            testUser.id(),
        specificInstant,
        1, 1, 1, 1, 4,
        List.of(),
        null
    );

    // When
    var entry = fromDto(dto, List.of());

    // Then
    assertEquals(specificInstant, entry.occurredOn());
  }

  @Test
  void shouldMapMultipleExposuresCorrectly() {
    // Given
    var exp1 = new ExposureType(UUID.randomUUID(), "Birch", "Tree pollen");
    var exp2 = new ExposureType(UUID.randomUUID(), "Grass", "Grass pollen");
    var exp3 = new ExposureType(UUID.randomUUID(), "Mold", "Indoor mold");

    var entry = new Entry(
        ENTRY_ID,
            testUser,
            ENTRY_INSTANT,
        new Symptoms(1),
        new Symptoms(1),
        new Symptoms(1),
        new Symptoms(1),
        new Note(null),
        Instant.now(),
        Instant.now(),
        List.of(exp1, exp2, exp3)
    );

    // When
    var dto = toDto(entry);

    // Then
    assertEquals(3, dto.exposures().size());
    assertTrue(dto.exposures().contains("Birch"));
    assertTrue(dto.exposures().contains("Grass"));
    assertTrue(dto.exposures().contains("Mold"));
  }
}
