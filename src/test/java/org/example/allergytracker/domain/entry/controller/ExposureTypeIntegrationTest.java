package org.example.allergytracker.domain.entry.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.example.allergytracker.domain.entry.model.ExposureType;
import org.example.allergytracker.domain.entry.repository.ExposureTypeRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;

import java.util.UUID;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource(properties = {
        "spring.datasource.url=jdbc:h2:mem:testdb",
        "spring.datasource.driver-class-name=org.h2.Driver",
        "spring.jpa.hibernate.ddl-auto=create-drop",
        "spring.jpa.show-sql=true"
})
@WithMockUser
class ExposureTypeIntegrationTest {

  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private ObjectMapper objectMapper;

  @Autowired
  private ExposureTypeRepository exposureTypeRepository;

  private UUID pollenId;

  @BeforeEach
  void setUp() {
    pollenId = UUID.randomUUID();
    UUID dustId = UUID.randomUUID();

    ExposureType pollen = new ExposureType(pollenId, "Pollen", "Tree and grass pollen");
    ExposureType dust = new ExposureType(dustId, "Dust", "House dust mites");

    exposureTypeRepository.save(pollen);
    exposureTypeRepository.save(dust);
  }

  @AfterEach
  void tearDown() {
    exposureTypeRepository.deleteAll();
  }

  @Test
  void shouldReturnAllExposureTypes() throws Exception {
    // When & Then
    mockMvc.perform(get("/api/exposure-types")
                    .contentType(MediaType.APPLICATION_JSON))
            .andDo(print())
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$", hasSize(2)))
            .andExpect(jsonPath("$[0].name", is("Pollen")))
            .andExpect(jsonPath("$[0].description", is("Tree and grass pollen")))
            .andExpect(jsonPath("$[1].name", is("Dust")))
            .andExpect(jsonPath("$[1].description", is("House dust mites")));
  }

  @Test
  void shouldReturnExposureTypeById() throws Exception {
    // When & Then - GET /api/exposure-types/{id}
    mockMvc.perform(get("/api/exposure-types/{id}", pollenId)
                    .contentType(MediaType.APPLICATION_JSON))
            .andDo(print())
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.id", is(pollenId.toString())))
            .andExpect(jsonPath("$.name", is("Pollen")))
            .andExpect(jsonPath("$.description", is("Tree and grass pollen")));
  }

  @Test
  void shouldReturn404WhenExposureTypeNotFound() throws Exception {
    // Given
    UUID nonExistentId = UUID.randomUUID();

    // When & Then
    mockMvc.perform(get("/api/exposure-types/{id}", nonExistentId)
                    .contentType(MediaType.APPLICATION_JSON))
            .andDo(print())
            .andExpect(status().isNotFound());
  }

  @Test
  void shouldCreateNewExposureType() throws Exception {
    UUID newId = UUID.randomUUID();
    ExposureTypeDto newExposure = new ExposureTypeDto(
            newId,
            "Cat",
            "Cat allergen"
    );

    String jsonContent = objectMapper.writeValueAsString(newExposure);

    // When & Then
    mockMvc.perform(post("/api/exposure-types")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(jsonContent))
            .andDo(print())
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.id", is(newId.toString())))
            .andExpect(jsonPath("$.name", is("Cat")))
            .andExpect(jsonPath("$.description", is("Cat allergen")));

    // Verify
    var saved = exposureTypeRepository.findById(newId);
    assert saved.isPresent();
    assert saved.get().value().equals("Cat");
  }

  @Test
  void shouldReturnCreatedExposureTypeInGetAllAfterPost() throws Exception {
    // Given
    UUID newId = UUID.randomUUID();
    ExposureTypeDto newExposure = new ExposureTypeDto(
            newId,
            "Mold",
            "Mold spores"
    );

    // When
    mockMvc.perform(post("/api/exposure-types")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(newExposure)))
            .andExpect(status().isOk());

    // Then - pobierz wszystkie i sprawdź czy nowy jest na liście
    mockMvc.perform(get("/api/exposure-types")
                    .contentType(MediaType.APPLICATION_JSON))
            .andDo(print())
            .andExpect(status().isOk())
            .andExpect(jsonPath("$", hasSize(3)))
            .andExpect(jsonPath("$[*].name", hasItem("Mold")))
            .andExpect(jsonPath("$[*].description", hasItem("Mold spores")));
  }

  @Test
  void shouldHandleCompleteWorkflow() throws Exception {
    mockMvc.perform(get("/api/exposure-types"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$", hasSize(2)));

    UUID dogId = UUID.randomUUID();
    ExposureTypeDto dog = new ExposureTypeDto(dogId, "Dog", "Dog allergen");

    mockMvc.perform(post("/api/exposure-types")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(dog)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.name", is("Dog")));

    mockMvc.perform(get("/api/exposure-types"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$", hasSize(3)));

    mockMvc.perform(get("/api/exposure-types/{id}", dogId))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.name", is("Dog")))
            .andExpect(jsonPath("$.description", is("Dog allergen")));
  }

  @Test
  void shouldValidateJsonStructure() throws Exception {
    // When & Then
    mockMvc.perform(get("/api/exposure-types/{id}", pollenId))
            .andDo(print())
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").exists())
            .andExpect(jsonPath("$.id").isString())
            .andExpect(jsonPath("$.name").exists())
            .andExpect(jsonPath("$.name").isString())
            .andExpect(jsonPath("$.description").exists())
            .andExpect(jsonPath("$.description").isString())
            .andExpect(jsonPath("$.*", hasSize(3)));
  }

  @Test
  void shouldReturnEmptyArrayWhenNoExposureTypes() throws Exception {
    // Given
    exposureTypeRepository.deleteAll();

    // When & Then
    mockMvc.perform(get("/api/exposure-types"))
            .andDo(print())
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$", hasSize(0)))
            .andExpect(jsonPath("$", is(empty())));
  }
}
