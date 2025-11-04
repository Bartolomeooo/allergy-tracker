package org.example.allergytracker.domain.entry.controller;

import lombok.RequiredArgsConstructor;
import org.example.allergytracker.domain.entry.service.ExposureTypeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping(ExposureTypeController.EXPOSURE_TYPE_API_PATH)
@RequiredArgsConstructor
public class ExposureTypeController {

    static final String EXPOSURE_TYPE_API_PATH = "/api/exposure-types";
    static final String ID_PATH = "/{id}";

    private final ExposureTypeService exposureTypeService;

    @GetMapping
    public List<ExposureTypeDto> getAllExposureTypes() {
        return exposureTypeService.findAll().stream()
                .map(EntryMapper::toDto)
                .toList();
    }

    @GetMapping(ID_PATH)
    public ResponseEntity<ExposureTypeDto> getExposureTypeById(@PathVariable UUID id) {
        return exposureTypeService.findById(id)
                .map(EntryMapper::toDto)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ExposureTypeDto createExposureType(@RequestBody ExposureTypeDto exposureTypeDto) {
        var exposureType = EntryMapper.fromDto(exposureTypeDto);
        var saved = exposureTypeService.save(exposureType);
        return EntryMapper.toDto(saved);
    }
}
