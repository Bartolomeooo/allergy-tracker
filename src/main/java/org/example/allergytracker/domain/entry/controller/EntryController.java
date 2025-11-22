package org.example.allergytracker.domain.entry.controller;

import lombok.RequiredArgsConstructor;
import org.example.allergytracker.domain.entry.model.ExposureType;
import org.example.allergytracker.domain.entry.service.EntryService;
import org.example.allergytracker.domain.entry.service.ExposureTypeService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

import static org.example.allergytracker.security.AuthenticationProvider.getCurrentUserId;

@RestController
@RequestMapping(EntryController.ENTRY_API_PATH)
@RequiredArgsConstructor
public class EntryController {

  static final String ENTRY_API_PATH = "/api/entries";
  static final String ID_PATH = "/{id}";

  private final EntryService entryService;
  private final ExposureTypeService exposureTypeService;

  @GetMapping
  public List<EntryDto> getAllEntries() {
    var userId = getCurrentUserId();
    return entryService.findAllByUserId(userId).stream()
            .map(EntryMapper::toDto)
            .toList();
  }

  @GetMapping(ID_PATH)
  public ResponseEntity<EntryDto> getEntryById(@PathVariable UUID id) {
    var userId = getCurrentUserId();
    return entryService.findByIdAndUserId(id, userId)
            .map(EntryMapper::toDto)
            .map(ResponseEntity::ok)
            .orElseGet(() -> ResponseEntity.notFound().build());
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public EntryDto createEntry(@RequestBody EntryDto entryDto) {
    var userId = getCurrentUserId();
    var exposureTypes = resolveExposureTypes(entryDto.exposures());
    var entry = EntryMapper.fromDto(entryDto, exposureTypes);
    var saved = entryService.save(entry, userId);
    return EntryMapper.toDto(saved);
  }

  @PutMapping(ID_PATH)
  public ResponseEntity<EntryDto> updateEntry(@PathVariable UUID id, @RequestBody EntryDto entryDto) {
    var userId = getCurrentUserId();
    if (entryService.findByIdAndUserId(id, userId).isEmpty()) {
      return ResponseEntity.notFound().build();
    }
    var exposureTypes = resolveExposureTypes(entryDto.exposures());
    var entry = EntryMapper.fromDto(entryDto, exposureTypes);
    var updated = entryService.save(entry, userId);
    return ResponseEntity.ok(EntryMapper.toDto(updated));
  }

  @DeleteMapping(ID_PATH)
  public ResponseEntity<Void> deleteEntry(@PathVariable UUID id) {
    var userId = getCurrentUserId();
    entryService.deleteByIdAndUserId(id, userId);
    return ResponseEntity.noContent().build();
  }

  private List<ExposureType> resolveExposureTypes(List<String> exposureNames) {
    return exposureNames.stream()
            .map(exposureTypeService::findByValue)
            .filter(java.util.Optional::isPresent)
            .map(java.util.Optional::get)
            .toList();
  }
}
