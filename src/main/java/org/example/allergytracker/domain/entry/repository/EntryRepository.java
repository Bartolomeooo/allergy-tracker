package org.example.allergytracker.domain.entry.repository;

import org.example.allergytracker.domain.entry.model.Entry;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface EntryRepository extends JpaRepository<Entry, UUID> {
}
