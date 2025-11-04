package org.example.allergytracker.domain.entry.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.example.allergytracker.domain.entry.model.ExposureType;
import org.example.allergytracker.domain.entry.service.ExposureTypeService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.hamcrest.Matchers.hasSize;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ExposureTypeController.class)
class ExposureTypeControllerTest {

    private static final String EXPOSURE_TYPE_API_PATH = "/api/exposure-types";
    private static final String EXPOSURE_TYPE_BY_ID_PATH = String.format("%s%s", EXPOSURE_TYPE_API_PATH, "/{id}");

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private ExposureTypeService exposureTypeService;

    private ExposureType catExposure;
    private ExposureType dustExposure;
    private UUID exposureId;

    @BeforeEach
    void setUp() {
        exposureId = UUID.randomUUID();
        catExposure = new ExposureType(exposureId, "Cat", "Cat allergen from saliva and dander");
        dustExposure = new ExposureType(UUID.randomUUID(), "Dust", "House dust mites");
    }

    @Test
    void shouldGetAllExposureTypes() throws Exception {
        // Given
        when(exposureTypeService.findAll()).thenReturn(List.of(catExposure, dustExposure));

        // When & Then
        mockMvc.perform(get(EXPOSURE_TYPE_API_PATH))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].id").value(exposureId.toString()))
                .andExpect(jsonPath("$[0].name").value("Cat"))
                .andExpect(jsonPath("$[0].description").value("Cat allergen from saliva and dander"))
                .andExpect(jsonPath("$[1].name").value("Dust"))
                .andExpect(jsonPath("$[1].description").value("House dust mites"));

        verify(exposureTypeService, times(1)).findAll();
    }

    @Test
    void shouldGetExposureTypeById() throws Exception {
        // Given
        when(exposureTypeService.findById(exposureId)).thenReturn(Optional.of(catExposure));

        // When & Then
        mockMvc.perform(get(EXPOSURE_TYPE_BY_ID_PATH, exposureId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(exposureId.toString()))
                .andExpect(jsonPath("$.name").value("Cat"))
                .andExpect(jsonPath("$.description").value("Cat allergen from saliva and dander"));

        verify(exposureTypeService, times(1)).findById(exposureId);
    }

    @Test
    void shouldReturn404WhenExposureTypeNotFound() throws Exception {
        // Given
        UUID nonExistentId = UUID.randomUUID();
        when(exposureTypeService.findById(nonExistentId)).thenReturn(Optional.empty());

        // When & Then
        mockMvc.perform(get(EXPOSURE_TYPE_BY_ID_PATH, nonExistentId))
                .andExpect(status().isNotFound());

        verify(exposureTypeService, times(1)).findById(nonExistentId);
    }

    @Test
    void shouldCreateExposureType() throws Exception {
        // Given
        when(exposureTypeService.save(any(ExposureType.class))).thenReturn(catExposure);

        var dto = new ExposureTypeDto(
                null,
                "Cat",
                "Cat allergen from saliva and dander"
        );

        // When & Then
        mockMvc.perform(post(EXPOSURE_TYPE_API_PATH)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(exposureId.toString()))
                .andExpect(jsonPath("$.name").value("Cat"))
                .andExpect(jsonPath("$.description").value("Cat allergen from saliva and dander"));

        verify(exposureTypeService, times(1)).save(any(ExposureType.class));
    }

    @Test
    void shouldCreateExposureTypeWithNullDescription() throws Exception {
        // Given
        var exposureWithoutDesc = new ExposureType(exposureId, "Pollen", null);
        when(exposureTypeService.save(any(ExposureType.class))).thenReturn(exposureWithoutDesc);

        var dto = new ExposureTypeDto(null, "Pollen", null);

        // When & Then
        mockMvc.perform(post(EXPOSURE_TYPE_API_PATH)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Pollen"))
                .andExpect(jsonPath("$.description").isEmpty());

        verify(exposureTypeService, times(1)).save(any(ExposureType.class));
    }

    @Test
    void shouldReturnEmptyListWhenNoExposureTypes() throws Exception {
        // Given
        when(exposureTypeService.findAll()).thenReturn(List.of());

        // When & Then
        mockMvc.perform(get(EXPOSURE_TYPE_API_PATH))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));

        verify(exposureTypeService, times(1)).findAll();
    }
}
