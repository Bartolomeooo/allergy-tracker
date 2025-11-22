package org.example.allergytracker.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

class JwtTokenProviderTest {

  private JwtTokenProvider jwtTokenProvider;
  private static final String SECRET = "test-secret-key-for-jwt-tokens-must-be-at-least-256-bits-long-for-testing";
  private static final long ACCESS_TOKEN_VALIDITY_MS = 900000; // 15 minutes
  private static final long REFRESH_TOKEN_VALIDITY_MS = 604800000; // 7 days
  private static final UUID TEST_USER_ID = UUID.randomUUID();

  @BeforeEach
  void setUp() {
    jwtTokenProvider = new JwtTokenProvider(SECRET, ACCESS_TOKEN_VALIDITY_MS, REFRESH_TOKEN_VALIDITY_MS);
  }

  @Test
  void generateAccessToken_ShouldReturnValidToken() {
    // When
    var token = jwtTokenProvider.generateAccessToken(TEST_USER_ID);

    // Then
    assertNotNull(token);
    assertFalse(token.isEmpty());
  }

  @Test
  void generateRefreshToken_ShouldReturnValidToken() {
    // When
    var token = jwtTokenProvider.generateRefreshToken(TEST_USER_ID);

    // Then
    assertNotNull(token);
    assertFalse(token.isEmpty());
  }

  @Test
  void validateToken_WithValidToken_ShouldReturnTrue() {
    // Given
    var token = jwtTokenProvider.generateAccessToken(TEST_USER_ID);

    // When
    var isValid = jwtTokenProvider.validateToken(token);

    // Then
    assertTrue(isValid);
  }

  @Test
  void validateToken_WithInvalidToken_ShouldReturnFalse() {
    // Given
    var invalidToken = "invalid.token.here";

    // When
    var isValid = jwtTokenProvider.validateToken(invalidToken);

    // Then
    assertFalse(isValid);
  }

  @Test
  void validateToken_WithEmptyToken_ShouldReturnFalse() {
    // When
    var isValid = jwtTokenProvider.validateToken("");

    // Then
    assertFalse(isValid);
  }

  @Test
  void getUserIdFromToken_ShouldReturnCorrectUserId() {
    // Given
    var token = jwtTokenProvider.generateAccessToken(TEST_USER_ID);

    // When
    var userId = jwtTokenProvider.getUserIdFromToken(token);

    // Then
    assertEquals(TEST_USER_ID, userId);
  }

  @Test
  void getUserIdFromToken_WithDifferentUserIds_ShouldReturnCorrectUserIds() {
    // Given
    var userId1 = UUID.randomUUID();
    var userId2 = UUID.randomUUID();
    var token1 = jwtTokenProvider.generateAccessToken(userId1);
    var token2 = jwtTokenProvider.generateAccessToken(userId2);

    // When
    var extractedUserId1 = jwtTokenProvider.getUserIdFromToken(token1);
    var extractedUserId2 = jwtTokenProvider.getUserIdFromToken(token2);

    // Then
    assertEquals(userId1, extractedUserId1);
    assertEquals(userId2, extractedUserId2);
    assertNotEquals(extractedUserId1, extractedUserId2);
  }

  @Test
  void generateAccessToken_WithDifferentSecret_ShouldNotValidate() {
    // Given
    var token = jwtTokenProvider.generateAccessToken(TEST_USER_ID);
    var differentProvider = new JwtTokenProvider(
            "different-secret-key-must-be-at-least-256-bits-long-for-testing-purposes",
            ACCESS_TOKEN_VALIDITY_MS,
            REFRESH_TOKEN_VALIDITY_MS
    );

    // When
    var isValid = differentProvider.validateToken(token);

    // Then
    assertFalse(isValid);
  }

  @Test
  void generateAccessToken_AndRefreshToken_ShouldBeDifferent() {
    // When
    var accessToken = jwtTokenProvider.generateAccessToken(TEST_USER_ID);
    var refreshToken = jwtTokenProvider.generateRefreshToken(TEST_USER_ID);

    // Then
    assertNotEquals(accessToken, refreshToken);
  }

  @Test
  void validateToken_BothAccessAndRefreshTokens_ShouldBeValid() {
    // Given
    var accessToken = jwtTokenProvider.generateAccessToken(TEST_USER_ID);
    var refreshToken = jwtTokenProvider.generateRefreshToken(TEST_USER_ID);

    // When & Then
    assertTrue(jwtTokenProvider.validateToken(accessToken));
    assertTrue(jwtTokenProvider.validateToken(refreshToken));
  }

  @Test
  void getUserIdFromToken_FromRefreshToken_ShouldReturnCorrectUserId() {
    // Given
    var refreshToken = jwtTokenProvider.generateRefreshToken(TEST_USER_ID);

    // When
    var userId = jwtTokenProvider.getUserIdFromToken(refreshToken);

    // Then
    assertEquals(TEST_USER_ID, userId);
  }
}
