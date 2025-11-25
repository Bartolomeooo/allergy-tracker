package org.example.allergytracker.domain.entry.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.example.allergytracker.domain.entry.model.ExposureType;
import org.example.allergytracker.domain.entry.repository.EntryRepository;
import org.example.allergytracker.domain.entry.repository.ExposureTypeRepository;
import org.example.allergytracker.domain.user.model.User;
import org.example.allergytracker.domain.user.repository.UserRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import static java.util.Collections.emptyList;
import static org.hamcrest.Matchers.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.authentication;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
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
class EntryIntegrationTest {

  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private ObjectMapper objectMapper;

  @Autowired
  private EntryRepository entryRepository;

  @Autowired
  private ExposureTypeRepository exposureTypeRepository;

  @Autowired
  private UserRepository userRepository;

  private UUID userId;
  private UUID pollenId;
  private UUID dustId;
  private UsernamePasswordAuthenticationToken auth;

  @BeforeEach
  void setUp() {
    entryRepository.deleteAll();
    exposureTypeRepository.deleteAll();
    userRepository.deleteAll();

    userId = UUID.randomUUID();
    var user = new User(
            userId,
            "test@example.com",
            "hashed-password",
            emptyList()
    );
    userRepository.save(user);

    auth = new UsernamePasswordAuthenticationToken(userId, null, List.of());

    pollenId = UUID.randomUUID();
    dustId = UUID.randomUUID();

    ExposureType pollen = new ExposureType(pollenId, "Pollen", "Tree pollen");
    ExposureType dust = new ExposureType(dustId, "Dust", "House dust");

    exposureTypeRepository.save(pollen);
    exposureTypeRepository.save(dust);
  }

  @AfterEach
  void tearDown() {
    SecurityContextHolder.clearContext();
    entryRepository.deleteAll();
    exposureTypeRepository.deleteAll();
    userRepository.deleteAll();
  }

  @Test
  void shouldCreateEntryWithExposures() throws Exception {
    // Given
    EntryDto entryDto = new EntryDto(
            null, userId, Instant.now(),
            3, 2, 1, 2, 8, List.of("Pollen", "Dust"),
            "Felt bad after walking in the park"
    );

    String jsonContent = objectMapper.writeValueAsString(entryDto);

    // When & Then
    mockMvc.perform(post("/api/entries")
                    .with(authentication(auth))
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(jsonContent))
            .andDo(print())
            .andExpect(status().isCreated())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.id").exists())
            .andExpect(jsonPath("$.upperRespiratory", is(3)))
            .andExpect(jsonPath("$.lowerRespiratory", is(2)))
            .andExpect(jsonPath("$.skin", is(1)))
            .andExpect(jsonPath("$.eyes", is(2)))
            .andExpect(jsonPath("$.total", is(8)))
            .andExpect(jsonPath("$.exposures", hasSize(2)))
            .andExpect(jsonPath("$.exposures", hasItems("Pollen", "Dust")))
            .andExpect(jsonPath("$.note", is("Felt bad after walking in the park")));
  }

  @Test
  void shouldGetAllEntriesForUser() throws Exception {
    // Given
    EntryDto entry1 = new EntryDto(
            null, userId, Instant.now().minusSeconds(3600),
            3, 2, 1, 2, 8, List.of("Pollen"), "Morning symptoms"
    );

    EntryDto entry2 = new EntryDto(
            null, userId, Instant.now(),
            1, 1, 0, 1, 3, List.of("Dust"), "Evening symptoms"
    );

    mockMvc.perform(post("/api/entries")
                    .with(authentication(auth))
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(entry1)))
            .andExpect(status().isCreated());

    mockMvc.perform(post("/api/entries")
                    .with(authentication(auth))
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(entry2)))
            .andExpect(status().isCreated());

    // When & Then
    mockMvc.perform(get("/api/entries")
                    .with(authentication(auth))
                    .contentType(MediaType.APPLICATION_JSON))
            .andDo(print())
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$", hasSize(2)))
            .andExpect(jsonPath("$[*].note", hasItems("Morning symptoms", "Evening symptoms")));
  }

  @Test
  void shouldGetEntryById() throws Exception {
    // Given
    EntryDto entryDto = new EntryDto(
            null, userId, Instant.now(),
            2, 2, 1, 1, 6, List.of("Pollen"), "Test entry"
    );

    String response = mockMvc.perform(post("/api/entries")
                    .with(authentication(auth))
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(entryDto)))
            .andExpect(status().isCreated())
            .andReturn()
            .getResponse()
            .getContentAsString();

    EntryDto createdEntry = objectMapper.readValue(response, EntryDto.class);
    UUID entryId = createdEntry.id();

    // When & Then
    mockMvc.perform(get("/api/entries/{id}", entryId)
                    .with(authentication(auth))
                    .contentType(MediaType.APPLICATION_JSON))
            .andDo(print())
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id", is(entryId.toString())))
            .andExpect(jsonPath("$.upperRespiratory", is(2)))
            .andExpect(jsonPath("$.note", is("Test entry")))
            .andExpect(jsonPath("$.exposures", hasItem("Pollen")));
  }

  @Test
  void shouldReturn404WhenEntryNotFound() throws Exception {
    // Given
    UUID nonExistentId = UUID.randomUUID();

    // When & Then
    mockMvc.perform(get("/api/entries/{id}", nonExistentId)
                    .with(authentication(auth))
                    .contentType(MediaType.APPLICATION_JSON))
            .andDo(print())
            .andExpect(status().isNotFound());
  }

  @Test
  void shouldUpdateEntry() throws Exception {
    // Given
    EntryDto originalEntry = new EntryDto(
            null, userId, Instant.now(),
            2, 2, 1, 1, 6, List.of("Pollen"), "Original note"
    );

    String createResponse = mockMvc.perform(post("/api/entries")
                    .with(authentication(auth))
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(originalEntry)))
            .andExpect(status().isCreated())
            .andReturn()
            .getResponse()
            .getContentAsString();

    EntryDto createdEntry = objectMapper.readValue(createResponse, EntryDto.class);
    UUID entryId = createdEntry.id();

    EntryDto updatedEntry = new EntryDto(
            entryId, userId, createdEntry.occurredOn(),
            3, 3, 2, 2, 10, List.of("Pollen", "Dust"), "Updated note"
    );

    // When & Then
    mockMvc.perform(put("/api/entries/{id}", entryId)
                    .with(authentication(auth))
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(updatedEntry)))
            .andDo(print())
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id", is(entryId.toString())))
            .andExpect(jsonPath("$.upperRespiratory", is(3)))
            .andExpect(jsonPath("$.total", is(10)))
            .andExpect(jsonPath("$.note", is("Updated note")))
            .andExpect(jsonPath("$.exposures", hasSize(2)));
  }

  @Test
  void shouldDeleteEntry() throws Exception {
    // Given
    EntryDto entryDto = new EntryDto(
            null, userId, Instant.now(),
            2, 2, 1, 1, 6, List.of("Pollen"), "To be deleted"
    );

    String response = mockMvc.perform(post("/api/entries")
                    .with(authentication(auth))
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(entryDto)))
            .andExpect(status().isCreated())
            .andReturn()
            .getResponse()
            .getContentAsString();

    EntryDto createdEntry = objectMapper.readValue(response, EntryDto.class);
    UUID entryId = createdEntry.id();

    mockMvc.perform(get("/api/entries/{id}", entryId)
                    .with(authentication(auth)))
            .andExpect(status().isOk());

    // When
    mockMvc.perform(delete("/api/entries/{id}", entryId)
                    .with(authentication(auth)))
            .andDo(print())
            .andExpect(status().isNoContent());

    // Then
    mockMvc.perform(get("/api/entries/{id}", entryId)
                    .with(authentication(auth)))
            .andExpect(status().isNotFound());
  }

  @Test
  void shouldHandleCompleteEntryWorkflow() throws Exception {
    // Given
    mockMvc.perform(get("/api/entries")
                    .with(authentication(auth)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$", hasSize(0)));

    EntryDto entry1 = new EntryDto(
            null, userId, Instant.now().minusSeconds(7200),
            4, 3, 2, 3, 12, List.of("Pollen"), "Severe reaction"
    );

    String response1 = mockMvc.perform(post("/api/entries")
                    .with(authentication(auth))
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(entry1)))
            .andExpect(status().isCreated())
            .andReturn().getResponse().getContentAsString();

    UUID entry1Id = objectMapper.readValue(response1, EntryDto.class).id();

    EntryDto entry2 = new EntryDto(
            null, userId, Instant.now(),
            1, 1, 0, 1, 3, List.of("Dust"), "Mild reaction"
    );

    mockMvc.perform(post("/api/entries")
                    .with(authentication(auth))
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(entry2)))
            .andExpect(status().isCreated());

    mockMvc.perform(get("/api/entries")
                    .with(authentication(auth)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$", hasSize(2)));

    EntryDto updatedEntry1 = new EntryDto(
            entry1Id, userId, entry1.occurredOn(),
            3, 2, 1, 2, 8, List.of("Pollen", "Dust"), "Updated: moderate reaction"
    );

    // When
    mockMvc.perform(put("/api/entries/{id}", entry1Id)
                    .with(authentication(auth))
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(updatedEntry1)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.total", is(8)))
            .andExpect(jsonPath("$.note", is("Updated: moderate reaction")));

    mockMvc.perform(delete("/api/entries/{id}", entry1Id)
                    .with(authentication(auth)))
            .andExpect(status().isNoContent());

    // Then
    mockMvc.perform(get("/api/entries")
                    .with(authentication(auth)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$", hasSize(1)))
            .andExpect(jsonPath("$[0].note", is("Mild reaction")));
  }

  @Test
  void shouldValidateEntryJsonStructure() throws Exception {
    // Given
    EntryDto entryDto = new EntryDto(
            null, userId, Instant.now(),
            2, 2, 1, 1, 6, List.of("Pollen"), "Test"
    );

    String response = mockMvc.perform(post("/api/entries")
                    .with(authentication(auth))
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(entryDto)))
            .andExpect(status().isCreated())
            .andReturn().getResponse().getContentAsString();

    EntryDto created = objectMapper.readValue(response, EntryDto.class);

    // When & Then
    mockMvc.perform(get("/api/entries/{id}", created.id())
                    .with(authentication(auth)))
            .andDo(print())
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").exists())
            .andExpect(jsonPath("$.id").isString())
            .andExpect(jsonPath("$.userId").exists())
            .andExpect(jsonPath("$.occurredOn").exists())
            .andExpect(jsonPath("$.upperRespiratory").isNumber())
            .andExpect(jsonPath("$.lowerRespiratory").isNumber())
            .andExpect(jsonPath("$.skin").isNumber())
            .andExpect(jsonPath("$.eyes").isNumber())
            .andExpect(jsonPath("$.total").isNumber())
            .andExpect(jsonPath("$.exposures").isArray())
            .andExpect(jsonPath("$.note").isString());
  }
}
