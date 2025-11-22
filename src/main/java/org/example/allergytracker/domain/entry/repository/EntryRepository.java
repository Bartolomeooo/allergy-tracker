package org.example.allergytracker.domain.entry.repository;

import org.example.allergytracker.domain.entry.model.Entry;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface EntryRepository extends JpaRepository<Entry, UUID> {
    List<Entry> findByUserId(UUID userId);

    Optional<Entry> findByIdAndUserId(UUID id, UUID userId);

    void deleteByIdAndUserId(UUID id, UUID userId);
}
