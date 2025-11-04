package org.example.allergytracker.domain.entry.repository;

import org.example.allergytracker.domain.entry.model.ExposureType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface ExposureTypeRepository extends JpaRepository<ExposureType, UUID> {
    Optional<ExposureType> findByValue(String value);
}
