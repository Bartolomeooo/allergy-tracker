package org.example.allergytracker.domain.entry.service;

import org.example.allergytracker.domain.entry.model.ExposureType;
import org.example.allergytracker.domain.entry.repository.ExposureTypeRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ExposureTypeServiceTest {

    @Mock
    private ExposureTypeRepository exposureTypeRepository;

    @InjectMocks
    private ExposureTypeService exposureTypeService;

    private ExposureType catExposure;
    private UUID exposureId;

    @BeforeEach
    void setUp() {
        exposureId = UUID.randomUUID();
        catExposure = new ExposureType(exposureId, "Cat", "Cat allergen");
    }

    @Test
    void shouldFindAllExposureTypes() {
        // Given
        when(exposureTypeRepository.findAll()).thenReturn(List.of(catExposure));

        // When
        var result = exposureTypeService.findAll();

        // Then
        assertThat(result).hasSize(1);
        assertThat(result.get(0).value()).isEqualTo("Cat");
        verify(exposureTypeRepository, times(1)).findAll();
    }

    @Test
    void shouldFindExposureTypeById() {
        // Given
        when(exposureTypeRepository.findById(exposureId)).thenReturn(Optional.of(catExposure));

        // When
        var result = exposureTypeService.findById(exposureId);

        // Then
        assertThat(result).isPresent();
        assertThat(result.get().id()).isEqualTo(exposureId);
        verify(exposureTypeRepository, times(1)).findById(exposureId);
    }

    @Test
    void shouldFindExposureTypeByValue() {
        // Given
        when(exposureTypeRepository.findByValue("Cat")).thenReturn(Optional.of(catExposure));

        // When
        var result = exposureTypeService.findByValue("Cat");

        // Then
        assertThat(result).isPresent();
        assertThat(result.get().value()).isEqualTo("Cat");
        verify(exposureTypeRepository, times(1)).findByValue("Cat");
    }

    @Test
    void shouldReturnEmptyWhenExposureTypeNotFoundByValue() {
        // Given
        when(exposureTypeRepository.findByValue("NonExistent")).thenReturn(Optional.empty());

        // When
        var result = exposureTypeService.findByValue("NonExistent");

        // Then
        assertThat(result).isEmpty();
        verify(exposureTypeRepository, times(1)).findByValue("NonExistent");
    }

    @Test
    void shouldSaveExposureType() {
        // Given
        when(exposureTypeRepository.save(any(ExposureType.class))).thenReturn(catExposure);

        // When
        var result = exposureTypeService.save(catExposure);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.value()).isEqualTo("Cat");
        verify(exposureTypeRepository, times(1)).save(catExposure);
    }

    @Test
    void shouldDeleteExposureType() {
        // Given
        doNothing().when(exposureTypeRepository).deleteById(exposureId);

        // When
        exposureTypeService.deleteById(exposureId);

        // Then
        verify(exposureTypeRepository, times(1)).deleteById(exposureId);
    }

    @Test
    void shouldCheckIfExposureTypeExists() {
        // Given
        when(exposureTypeRepository.existsById(exposureId)).thenReturn(true);

        // When
        var result = exposureTypeService.existsById(exposureId);

        // Then
        assertThat(result).isTrue();
        verify(exposureTypeRepository, times(1)).existsById(exposureId);
    }

    @Test
    void shouldReturnFalseWhenExposureTypeDoesNotExist() {
        // Given
        UUID nonExistentId = UUID.randomUUID();
        when(exposureTypeRepository.existsById(nonExistentId)).thenReturn(false);

        // When
        var result = exposureTypeService.existsById(nonExistentId);

        // Then
        assertThat(result).isFalse();
        verify(exposureTypeRepository, times(1)).existsById(nonExistentId);
    }
}
