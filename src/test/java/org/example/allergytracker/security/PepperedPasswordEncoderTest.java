package org.example.allergytracker.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class PepperedPasswordEncoderTest {

  private static final String PEPPER = "test-pepper-secret";
  private static final String PASSWORD = "password123";
  private PepperedPasswordEncoder encoder;

  @BeforeEach
  void setUp() {
    encoder = new PepperedPasswordEncoder(PEPPER);
  }

  @Test
  void encode_ShouldReturnEncodedPassword() {
    // When
    var encoded = encoder.encode(PASSWORD);

    // Then
    assertNotNull(encoded);
    assertNotEquals(PASSWORD, encoded);
  }

  @Test
  void encode_SamePassword_ShouldReturnDifferentHash() {
    // When
    var encoded1 = encoder.encode(PASSWORD);
    var encoded2 = encoder.encode(PASSWORD);

    // Then
    assertNotEquals(encoded1, encoded2, "BCrypt should generate different salts");
  }

  @Test
  void matches_WithCorrectPassword_ShouldReturnTrue() {
    // Given
    var encoded = encoder.encode(PASSWORD);

    // When
    var matches = encoder.matches(PASSWORD, encoded);

    // Then
    assertTrue(matches);
  }

  @Test
  void matches_WithIncorrectPassword_ShouldReturnFalse() {
    // Given
    var encoded = encoder.encode(PASSWORD);

    // When
    var matches = encoder.matches("wrongPassword", encoded);

    // Then
    assertFalse(matches);
  }

  @Test
  void matches_WithDifferentPepper_ShouldReturnFalse() {
    // Given
    var encoded = encoder.encode(PASSWORD);
    var differentEncoder = new PepperedPasswordEncoder("different-pepper");

    // When
    var matches = differentEncoder.matches(PASSWORD, encoded);

    // Then
    assertFalse(matches, "Password should not match with different pepper");
  }

  @Test
  void matches_WithEmptyPassword_ShouldWork() {
    // Given
    var emptyPassword = "";
    var encoded = encoder.encode(emptyPassword);

    // When
    var matches = encoder.matches(emptyPassword, encoded);

    // Then
    assertTrue(matches);
  }

  @Test
  void encode_WithSpecialCharacters_ShouldWork() {
    // Given
    var specialPassword = "p@ssw0rd!#$%^&*()";

    // When
    var encoded = encoder.encode(specialPassword);
    var matches = encoder.matches(specialPassword, encoded);

    // Then
    assertTrue(matches);
  }

  @Test
  void encode_WithUnicodeCharacters_ShouldWork() {
    // Given
    var unicodePassword = "пароль密码🔐";

    // When
    var encoded = encoder.encode(unicodePassword);
    var matches = encoder.matches(unicodePassword, encoded);

    // Then
    assertTrue(matches);
  }
}
