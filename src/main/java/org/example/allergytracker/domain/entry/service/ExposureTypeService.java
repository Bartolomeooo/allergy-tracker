package org.example.allergytracker.domain.entry.service;

import lombok.RequiredArgsConstructor;
import org.example.allergytracker.domain.entry.model.ExposureType;
import org.example.allergytracker.domain.entry.repository.ExposureTypeRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ExposureTypeService {

    private final ExposureTypeRepository exposureTypeRepository;

    public List<ExposureType> findAll() {
        return exposureTypeRepository.findAll();
    }

    public Optional<ExposureType> findById(UUID id) {
        return exposureTypeRepository.findById(id);
    }

    public Optional<ExposureType> findByValue(String value) {
        return exposureTypeRepository.findByValue(value);
    }

    public ExposureType save(ExposureType exposureType) {
        return exposureTypeRepository.save(exposureType);
    }

    public void deleteById(UUID id) {
        exposureTypeRepository.deleteById(id);
    }

    public boolean existsById(UUID id) {
        return exposureTypeRepository.existsById(id);
    }
}
