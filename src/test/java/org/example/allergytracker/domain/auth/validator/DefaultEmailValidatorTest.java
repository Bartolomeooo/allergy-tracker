package org.example.allergytracker.domain.auth.validator;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

class DefaultEmailValidatorTest {

  private DefaultEmailValidator emailValidator;

  @BeforeEach
  void setUp() {
    emailValidator = new DefaultEmailValidator();
  }

  @Test
  void normalize_ShouldTrimAndLowerCase() {
    // Given
    var email = " TeSt@ExAmPlE.CoM  ";

    // When
    var result = emailValidator.normalize(email);

    // Then
    assertEquals("test@example.com", result);
  }

  @Test
  void normalize_WithAlreadyNormalizedEmail_ShouldReturnSame() {
    // Given
    var email = "test@example.com";

    // When
    var result = emailValidator.normalize(email);

    // Then
    assertEquals(email, result);
  }

  @Test
  void normalize_WithOnlySpaces_ShouldTrimSpaces() {
    // Given
    var email = "   test@example.com   ";

    // When
    var result = emailValidator.normalize(email);

    // Then
    assertEquals("test@example.com", result);
  }

  @Test
  void normalize_WithUpperCase_ShouldConvertToLowerCase() {
    // Given
    var email = "TEST@EXAMPLE.COM";

    // When
    var result = emailValidator.normalize(email);

    // Then
    assertEquals("test@example.com", result);
  }

  @Test
  void normalize_WithMixedCase_ShouldConvertToLowerCase() {
    // Given
    String email = "TeSt.UsEr@ExAmPlE.CoM";

    // When
    String result = emailValidator.normalize(email);

    // Then
    assertEquals("test.user@example.com", result);
  }
}
