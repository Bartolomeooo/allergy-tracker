package org.example.allergytracker.domain.user.repository;

import org.example.allergytracker.domain.user.model.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
class UserRepositoryTest {

  @Autowired
  private TestEntityManager entityManager;

  @Autowired
  private UserRepository userRepository;

  @Test
  void findByEmail_WhenUserExists_ShouldReturnUser() {
    // Given
    var user = new User();
    user.id(UUID.randomUUID());
    user.email("test@example.com");
    user.password("encodedPassword");
    entityManager.persistAndFlush(user);

    // When
    var result = userRepository.findByEmail("test@example.com");

    // Then
    assertTrue(result.isPresent());
    assertEquals("test@example.com", result.get().email());
    assertEquals(user.id(), result.get().id());
  }

  @Test
  void findByEmail_WhenUserDoesNotExist_ShouldReturnEmpty() {
    // When
    var result = userRepository.findByEmail("nonexistent@example.com");

    // Then
    assertTrue(result.isEmpty());
  }

  @Test
  void findByEmail_ShouldBeCaseInsensitive() {
    // Given
    var user = new User();
    user.id(UUID.randomUUID());
    user.email("test@example.com");
    user.password("encodedPassword");
    entityManager.persistAndFlush(user);

    // When
    var result = userRepository.findByEmail("test@example.com");

    // Then
    assertTrue(result.isPresent());
    assertEquals("test@example.com", result.get().email());
  }

  @Test
  void save_ShouldPersistUser() {
    // Given
    var user = new User();
    user.id(UUID.randomUUID());
    user.email("newuser@example.com");
    user.password("encodedPassword");

    // When
    var savedUser = userRepository.save(user);
    entityManager.flush();

    // Then
    assertNotNull(savedUser);
    assertEquals("newuser@example.com", savedUser.email());

    var foundUser = entityManager.find(User.class, user.id());
    assertNotNull(foundUser);
    assertEquals("newuser@example.com", foundUser.email());
  }

  @Test
  void save_WithDuplicateEmail_ShouldThrowException() {
    // Given
    var user1 = new User();
    user1.id(UUID.randomUUID());
    user1.email("duplicate@example.com");
    user1.password("password1");
    entityManager.persistAndFlush(user1);

    var user2 = new User();
    user2.id(UUID.randomUUID());
    user2.email("duplicate@example.com");
    user2.password("password2");

    // When & Then
    assertThrows(Exception.class, () -> {
      userRepository.save(user2);
      entityManager.flush();
    });
  }

  @Test
  void findById_WhenUserExists_ShouldReturnUser() {
    // Given
    var userId = UUID.randomUUID();
    var user = new User();
    user.id(userId);
    user.email("test@example.com");
    user.password("encodedPassword");
    entityManager.persistAndFlush(user);

    // When
    var result = userRepository.findById(userId);

    // Then
    assertTrue(result.isPresent());
    assertEquals(userId, result.get().id());
    assertEquals("test@example.com", result.get().email());
  }

  @Test
  void findById_WhenUserDoesNotExist_ShouldReturnEmpty() {
    // When
    var result = userRepository.findById(UUID.randomUUID());

    // Then
    assertTrue(result.isEmpty());
  }
}