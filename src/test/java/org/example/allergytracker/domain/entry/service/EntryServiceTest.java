package org.example.allergytracker.domain.entry.service;

import org.example.allergytracker.domain.entry.model.Entry;
import org.example.allergytracker.domain.entry.model.Note;
import org.example.allergytracker.domain.entry.model.Symptoms;
import org.example.allergytracker.domain.entry.repository.EntryRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EntryServiceTest {

    @Mock
    private EntryRepository entryRepository;

    @InjectMocks
    private EntryService entryService;

    private Entry testEntry;
    private UUID entryId;

    @BeforeEach
    void setUp() {
        entryId = UUID.randomUUID();
        testEntry = new Entry(
                entryId,
                LocalDate.of(2025, 11, 4),
                new Symptoms(2),
                new Symptoms(3),
                new Symptoms(1),
                new Symptoms(4),
                new Note("Test note"),
                Instant.now(),
                Instant.now(),
                List.of()
        );
    }

    @Test
    void shouldFindAllEntries() {
        // Given
        when(entryRepository.findAll()).thenReturn(List.of(testEntry));

        // When
        var result = entryService.findAll();

        // Then
        assertThat(result).hasSize(1);
        assertThat(result.get(0).id()).isEqualTo(entryId);
        verify(entryRepository, times(1)).findAll();
    }

    @Test
    void shouldFindEntryById() {
        // Given
        when(entryRepository.findById(entryId)).thenReturn(Optional.of(testEntry));

        // When
        var result = entryService.findById(entryId);

        // Then
        assertThat(result).isPresent();
        assertThat(result.get().id()).isEqualTo(entryId);
        verify(entryRepository, times(1)).findById(entryId);
    }

    @Test
    void shouldReturnEmptyWhenEntryNotFound() {
        // Given
        UUID nonExistentId = UUID.randomUUID();
        when(entryRepository.findById(nonExistentId)).thenReturn(Optional.empty());

        // When
        var result = entryService.findById(nonExistentId);

        // Then
        assertThat(result).isEmpty();
        verify(entryRepository, times(1)).findById(nonExistentId);
    }

    @Test
    void shouldSaveEntry() {
        // Given
        when(entryRepository.save(any(Entry.class))).thenReturn(testEntry);

        // When
        var result = entryService.save(testEntry);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.id()).isEqualTo(entryId);
        verify(entryRepository, times(1)).save(testEntry);
    }

    @Test
    void shouldDeleteEntry() {
        // Given
        doNothing().when(entryRepository).deleteById(entryId);

        // When
        entryService.deleteById(entryId);

        // Then
        verify(entryRepository, times(1)).deleteById(entryId);
    }

    @Test
    void shouldReturnEmptyListWhenNoEntries() {
        // Given
        when(entryRepository.findAll()).thenReturn(List.of());

        // When
        var result = entryService.findAll();

        // Then
        assertThat(result).isEmpty();
        verify(entryRepository, times(1)).findAll();
    }
}
