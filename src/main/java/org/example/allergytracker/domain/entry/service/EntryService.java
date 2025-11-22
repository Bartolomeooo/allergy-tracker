package org.example.allergytracker.domain.entry.service;

import lombok.RequiredArgsConstructor;
import org.example.allergytracker.domain.entry.model.Entry;
import org.example.allergytracker.domain.entry.repository.EntryRepository;
import org.example.allergytracker.domain.user.model.User;
import org.example.allergytracker.domain.user.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class EntryService {

  private final EntryRepository entryRepository;
  private final UserRepository userRepository;

  public List<Entry> findAllByUserId(UUID userId) {
    return entryRepository.findByUserId(userId);
  }

  public Optional<Entry> findByIdAndUserId(UUID id, UUID userId) {
    return entryRepository.findByIdAndUserId(id, userId);
  }

  @Transactional
  public Entry save(Entry entry, UUID userId) {
    User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));

    entry.user(user);
    return entryRepository.save(entry);
  }

  @Transactional
  public void deleteByIdAndUserId(UUID id, UUID userId) {
    if (entryRepository.findByIdAndUserId(id, userId).isEmpty()) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Entry not found");
    }
    entryRepository.deleteByIdAndUserId(id, userId);
  }
}
