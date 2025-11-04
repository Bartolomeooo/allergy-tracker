package org.example.allergytracker.domain.entry.service;

import lombok.RequiredArgsConstructor;
import org.example.allergytracker.domain.entry.model.Entry;
import org.example.allergytracker.domain.entry.repository.EntryRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class EntryService {

  private final EntryRepository entryRepository;

  public List<Entry> findAll() {
    return entryRepository.findAll();
  }

  public Optional<Entry> findById(UUID id) {
    return entryRepository.findById(id);
  }

  public Entry save(Entry entry) {
    return entryRepository.save(entry);
  }

  public void deleteById(UUID id) {
    entryRepository.deleteById(id);
  }
}
