package org.example.allergytracker.domain.entry.controller;

import lombok.RequiredArgsConstructor;
import org.example.allergytracker.domain.entry.model.ExposureType;
import org.example.allergytracker.domain.entry.service.EntryService;
import org.example.allergytracker.domain.entry.service.ExposureTypeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

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
    return entryService.findAll().stream()
            .map(EntryMapper::toDto)
            .toList();
  }

  @GetMapping(ID_PATH)
  public ResponseEntity<EntryDto> getEntryById(@PathVariable UUID id) {
    return entryService.findById(id)
            .map(EntryMapper::toDto)
            .map(ResponseEntity::ok)
            .orElseGet(() -> ResponseEntity.notFound().build());
  }

  @PostMapping
  public EntryDto createEntry(@RequestBody EntryDto entryDto) {
    var exposureTypes = resolveExposureTypes(entryDto.exposures());
    var entry = EntryMapper.fromDto(entryDto, exposureTypes);
    var saved = entryService.save(entry);
    return EntryMapper.toDto(saved);
  }

  @PutMapping(ID_PATH)
  public ResponseEntity<EntryDto> updateEntry(@PathVariable UUID id, @RequestBody EntryDto entryDto) {
    if (entryService.findById(id).isEmpty()) {
      return ResponseEntity.notFound().build();
    }
    var exposureTypes = resolveExposureTypes(entryDto.exposures());
    var entry = EntryMapper.fromDto(entryDto, exposureTypes);
    var updated = entryService.save(entry);
    return ResponseEntity.ok(EntryMapper.toDto(updated));
  }

  @DeleteMapping(ID_PATH)
  public ResponseEntity<Void> deleteEntry(@PathVariable UUID id) {
    if (entryService.findById(id).isEmpty()) {
      return ResponseEntity.notFound().build();
    }
    entryService.deleteById(id);
    return ResponseEntity.noContent().build();
  }

  private List<ExposureType> resolveExposureTypes(List<String> exposureNames) {
    return exposureNames.stream()
            .map(exposureTypeService::findByValue)
            .filter(Optional::isPresent)
            .map(Optional::get)
            .toList();
  }
}
