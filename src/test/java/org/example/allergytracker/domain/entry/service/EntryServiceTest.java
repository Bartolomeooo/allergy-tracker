package org.example.allergytracker.domain.entry.service;

import org.example.allergytracker.domain.entry.model.Entry;
import org.example.allergytracker.domain.entry.model.Note;
import org.example.allergytracker.domain.entry.model.Symptoms;
import org.example.allergytracker.domain.entry.repository.EntryRepository;
import org.example.allergytracker.domain.user.model.User;
import org.example.allergytracker.domain.user.repository.UserRepository;
import org.example.allergytracker.exception.auth.UserNotFoundException;
import org.example.allergytracker.exception.entry.EntryNotFoundException;
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
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EntryServiceTest {

    @Mock
    private EntryRepository entryRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private EntryService entryService;

    private Entry testEntry;
    private User testUser;
    private UUID entryId;
    private UUID userId;

    @BeforeEach
    void setUp() {
        entryId = UUID.randomUUID();
        userId = UUID.randomUUID();

        testUser = new User();
        testUser.id(userId);
        testUser.email("test@example.com");
        testUser.password("encodedPassword");

        testEntry = new Entry(
                entryId,
                testUser,
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
    void shouldFindAllEntriesByUserId() {
        // Given
        when(entryRepository.findByUserId(userId)).thenReturn(List.of(testEntry));

        // When
        var result = entryService.findAllByUserId(userId);

        // Then
        assertThat(result).hasSize(1);
        assertThat(result.getFirst().id()).isEqualTo(entryId);
        verify(entryRepository, times(1)).findByUserId(userId);
    }

    @Test
    void shouldFindEntryByIdAndUserId() {
        // Given
        when(entryRepository.findByIdAndUserId(entryId, userId)).thenReturn(Optional.of(testEntry));

        // When
        var result = entryService.findByIdAndUserId(entryId, userId);

        // Then
        assertThat(result).isPresent();
        assertThat(result.get().id()).isEqualTo(entryId);
        assertThat(result.get().user().id()).isEqualTo(userId);
        verify(entryRepository, times(1)).findByIdAndUserId(entryId, userId);
    }

    @Test
    void shouldReturnEmptyWhenEntryNotFoundForUser() {
        // Given
        UUID nonExistentId = UUID.randomUUID();
        when(entryRepository.findByIdAndUserId(nonExistentId, userId)).thenReturn(Optional.empty());

        // When
        var result = entryService.findByIdAndUserId(nonExistentId, userId);

        // Then
        assertThat(result).isEmpty();
        verify(entryRepository, times(1)).findByIdAndUserId(nonExistentId, userId);
    }

    @Test
    void shouldSaveEntry() {
        // Given
        Entry entryToSave = new Entry();
        entryToSave.id(UUID.randomUUID());
        entryToSave.occurredOn(LocalDate.of(2025, 11, 4));
        entryToSave.upperRespiratory(new Symptoms(2));
        entryToSave.lowerRespiratory(new Symptoms(3));
        entryToSave.skin(new Symptoms(1));
        entryToSave.eyes(new Symptoms(4));
        entryToSave.note(new Note("Test note"));

        when(userRepository.findById(userId)).thenReturn(Optional.of(testUser));
        when(entryRepository.save(any(Entry.class))).thenReturn(testEntry);

        // When
        var result = entryService.save(entryToSave, userId);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.id()).isEqualTo(entryId);
        assertThat(result.user()).isEqualTo(testUser);
        verify(userRepository, times(1)).findById(userId);
        verify(entryRepository, times(1)).save(entryToSave);
    }

    @Test
    void shouldThrowExceptionWhenSavingEntryWithNonExistentUser() {
        // Given
        Entry entryToSave = new Entry();
        UUID nonExistentUserId = UUID.randomUUID();
        when(userRepository.findById(nonExistentUserId)).thenReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> entryService.save(entryToSave, nonExistentUserId))
                .isInstanceOf(UserNotFoundException.class);

        verify(userRepository, times(1)).findById(nonExistentUserId);
        verify(entryRepository, never()).save(any());
    }

    @Test
    void shouldDeleteEntryByIdAndUserId() {
        // Given
        when(entryRepository.findByIdAndUserId(entryId, userId)).thenReturn(Optional.of(testEntry));
        doNothing().when(entryRepository).deleteByIdAndUserId(entryId, userId);

        // When
        entryService.deleteByIdAndUserId(entryId, userId);

        // Then
        verify(entryRepository, times(1)).findByIdAndUserId(entryId, userId);
        verify(entryRepository, times(1)).deleteByIdAndUserId(entryId, userId);
    }

    @Test
    void shouldThrowExceptionWhenDeletingNonExistentEntry() {
        // Given
        UUID nonExistentId = UUID.randomUUID();
        when(entryRepository.findByIdAndUserId(nonExistentId, userId)).thenReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> entryService.deleteByIdAndUserId(nonExistentId, userId))
                .isInstanceOf(EntryNotFoundException.class);

        verify(entryRepository, times(1)).findByIdAndUserId(nonExistentId, userId);
        verify(entryRepository, never()).deleteByIdAndUserId(any(), any());
    }

    @Test
    void shouldReturnEmptyListWhenNoEntriesForUser() {
        // Given
        when(entryRepository.findByUserId(userId)).thenReturn(List.of());

        // When
        var result = entryService.findAllByUserId(userId);

        // Then
        assertThat(result).isEmpty();
        verify(entryRepository, times(1)).findByUserId(userId);
    }

    @Test
    void shouldFindMultipleEntriesForUser() {
        // Given
        Entry entry2 = new Entry(
                UUID.randomUUID(),
                testUser,
                LocalDate.of(2025, 11, 5),
                new Symptoms(1),
                new Symptoms(1),
                new Symptoms(1),
                new Symptoms(1),
                new Note("Another note"),
                Instant.now(),
                Instant.now(),
                List.of()
        );
        when(entryRepository.findByUserId(userId)).thenReturn(List.of(testEntry, entry2));

        // When
        var result = entryService.findAllByUserId(userId);

        // Then
        assertThat(result).hasSize(2);
        assertThat(result).containsExactly(testEntry, entry2);
        verify(entryRepository, times(1)).findByUserId(userId);
    }
}
