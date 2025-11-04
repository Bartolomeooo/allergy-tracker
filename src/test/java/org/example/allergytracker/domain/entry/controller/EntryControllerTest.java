package org.example.allergytracker.domain.entry.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.example.allergytracker.domain.entry.model.Entry;
import org.example.allergytracker.domain.entry.model.ExposureType;
import org.example.allergytracker.domain.entry.model.Note;
import org.example.allergytracker.domain.entry.model.Symptoms;
import org.example.allergytracker.domain.entry.service.EntryService;
import org.example.allergytracker.domain.entry.service.ExposureTypeService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(EntryController.class)
class EntryControllerTest {

    private static final String ENTRY_API_PATH = "/api/entries";
    private static final String ENTRY_BY_ID_PATH = String.format("%s%s", ENTRY_API_PATH, "/{id}");

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private EntryService entryService;

    @MockitoBean
    private ExposureTypeService exposureTypeService;

    private Entry testEntry;
    private ExposureType catExposure;
    private ExposureType dustExposure;
    private UUID entryId;

    @BeforeEach
    void setUp() {
        entryId = UUID.randomUUID();
        catExposure = new ExposureType(UUID.randomUUID(), "Cat", "Cat allergen");
        dustExposure = new ExposureType(UUID.randomUUID(), "Dust", "Dust allergen");

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
                List.of(catExposure, dustExposure)
        );
    }

    @Test
    void shouldGetAllEntries() throws Exception {
        // Given
        when(entryService.findAll()).thenReturn(List.of(testEntry));

        // When & Then
        mockMvc.perform(get(ENTRY_API_PATH))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].id").value(entryId.toString()))
                .andExpect(jsonPath("$[0].upperRespiratory").value(2))
                .andExpect(jsonPath("$[0].lowerRespiratory").value(3))
                .andExpect(jsonPath("$[0].skin").value(1))
                .andExpect(jsonPath("$[0].eyes").value(4))
                .andExpect(jsonPath("$[0].total").value(10))
                .andExpect(jsonPath("$[0].exposures", hasSize(2)))
                .andExpect(jsonPath("$[0].exposures", containsInAnyOrder("Cat", "Dust")))
                .andExpect(jsonPath("$[0].note").value("Test note"));

        verify(entryService, times(1)).findAll();
    }

    @Test
    void shouldGetEntryById() throws Exception {
        // Given
        when(entryService.findById(entryId)).thenReturn(Optional.of(testEntry));

        // When & Then
        mockMvc.perform(get(ENTRY_BY_ID_PATH, entryId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(entryId.toString()))
                .andExpect(jsonPath("$.total").value(10))
                .andExpect(jsonPath("$.note").value("Test note"));

        verify(entryService, times(1)).findById(entryId);
    }

    @Test
    void shouldReturn404WhenEntryNotFound() throws Exception {
        // Given
        UUID nonExistentId = UUID.randomUUID();
        when(entryService.findById(nonExistentId)).thenReturn(Optional.empty());

        // When & Then
        mockMvc.perform(get(ENTRY_BY_ID_PATH, nonExistentId))
                .andExpect(status().isNotFound());

        verify(entryService, times(1)).findById(nonExistentId);
    }

    @Test
    void shouldCreateEntry() throws Exception {
        // Given
        when(exposureTypeService.findByValue("Cat")).thenReturn(Optional.of(catExposure));
        when(exposureTypeService.findByValue("Dust")).thenReturn(Optional.of(dustExposure));
        when(entryService.save(any(Entry.class))).thenReturn(testEntry);

        var dto = new EntryDto(
                null,
                LocalDate.of(2025, 11, 4).atStartOfDay(ZoneId.systemDefault()).toInstant(),
                2,
                3,
                1,
                4,
                10,
                List.of("Cat", "Dust"),
                "Test note"
        );

        // When & Then
        mockMvc.perform(post(ENTRY_API_PATH)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(entryId.toString()))
                .andExpect(jsonPath("$.total").value(10))
                .andExpect(jsonPath("$.exposures", hasSize(2)));

        verify(entryService, times(1)).save(any(Entry.class));
    }

    @Test
    void shouldUpdateEntry() throws Exception {
        // Given
        when(entryService.findById(entryId)).thenReturn(Optional.of(testEntry));
        when(exposureTypeService.findByValue("Cat")).thenReturn(Optional.of(catExposure));
        when(entryService.save(any(Entry.class))).thenReturn(testEntry);

        var dto = new EntryDto(
                entryId,
                LocalDate.of(2025, 11, 4).atStartOfDay(ZoneId.systemDefault()).toInstant(),
                5,
                5,
                5,
                5,
                20,
                List.of("Cat"),
                "Updated note"
        );

        // When & Then
        mockMvc.perform(put(ENTRY_BY_ID_PATH, entryId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk());

        verify(entryService, times(1)).findById(entryId);
        verify(entryService, times(1)).save(any(Entry.class));
    }

    @Test
    void shouldReturn404WhenUpdatingNonExistentEntry() throws Exception {
        // Given
        UUID nonExistentId = UUID.randomUUID();
        when(entryService.findById(nonExistentId)).thenReturn(Optional.empty());

        var dto = new EntryDto(
                nonExistentId,
                Instant.now(),
                1, 1, 1, 1, 4,
                List.of("Cat"),
                "Note"
        );

        // When & Then
        mockMvc.perform(put(ENTRY_BY_ID_PATH, nonExistentId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isNotFound());

        verify(entryService, times(1)).findById(nonExistentId);
        verify(entryService, never()).save(any(Entry.class));
    }

    @Test
    void shouldDeleteEntry() throws Exception {
        // Given
        when(entryService.findById(entryId)).thenReturn(Optional.of(testEntry));
        doNothing().when(entryService).deleteById(entryId);

        // When & Then
        mockMvc.perform(delete(ENTRY_BY_ID_PATH, entryId))
                .andExpect(status().isNoContent());

        verify(entryService, times(1)).findById(entryId);
        verify(entryService, times(1)).deleteById(entryId);
    }

    @Test
    void shouldReturn404WhenDeletingNonExistentEntry() throws Exception {
        // Given
        UUID nonExistentId = UUID.randomUUID();
        when(entryService.findById(nonExistentId)).thenReturn(Optional.empty());

        // When & Then
        mockMvc.perform(delete(ENTRY_BY_ID_PATH, nonExistentId))
                .andExpect(status().isNotFound());

        verify(entryService, times(1)).findById(nonExistentId);
        verify(entryService, never()).deleteById(any());
    }

    @Test
    void shouldHandleEmptyExposureList() throws Exception {
        // Given
        var entryWithoutExposures = new Entry(
                entryId,
                LocalDate.of(2025, 11, 4),
                new Symptoms(1),
                new Symptoms(1),
                new Symptoms(1),
                new Symptoms(1),
                new Note(null),
                Instant.now(),
                Instant.now(),
                List.of()
        );
        when(entryService.findAll()).thenReturn(List.of(entryWithoutExposures));

        // When & Then
        mockMvc.perform(get(ENTRY_API_PATH))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].exposures", hasSize(0)))
                .andExpect(jsonPath("$[0].note").isEmpty());
    }

    @Test
    void shouldFilterOutNonExistentExposures() throws Exception {
        // Given
        when(exposureTypeService.findByValue("Cat")).thenReturn(Optional.of(catExposure));
        when(exposureTypeService.findByValue("NonExistent")).thenReturn(Optional.empty());
        when(entryService.save(any(Entry.class))).thenReturn(testEntry);

        var dto = new EntryDto(
                null,
                Instant.now(),
                1, 1, 1, 1, 4,
                List.of("Cat", "NonExistent"),
                "Note"
        );

        // When & Then
        mockMvc.perform(post(ENTRY_API_PATH)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk());

        verify(exposureTypeService, times(1)).findByValue("Cat");
        verify(exposureTypeService, times(1)).findByValue("NonExistent");
    }
}
