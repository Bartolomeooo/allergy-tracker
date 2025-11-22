package org.example.allergytracker.domain.auth.service;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.example.allergytracker.domain.auth.dto.LoginRequest;
import org.example.allergytracker.domain.auth.dto.RegisterRequest;
import org.example.allergytracker.domain.auth.validator.EmailValidator;
import org.example.allergytracker.domain.user.model.User;
import org.example.allergytracker.domain.user.repository.UserRepository;
import org.example.allergytracker.exception.auth.EmailAlreadyInUseException;
import org.example.allergytracker.exception.auth.InvalidCredentialsException;
import org.example.allergytracker.exception.auth.InvalidRefreshTokenException;
import org.example.allergytracker.exception.auth.UserNotFoundException;
import org.example.allergytracker.security.JwtTokenProvider;
import org.example.allergytracker.security.cookie.CookieManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

  @Mock
  private UserRepository userRepository;

  @Mock
  private PasswordEncoder passwordEncoder;

  @Mock
  private JwtTokenProvider jwtTokenProvider;

  @Mock
  private CookieManager cookieManager;

  @Mock
  private EmailValidator emailValidator;

  @Mock
  private HttpServletRequest request;

  @Mock
  private HttpServletResponse response;

  @InjectMocks
  private AuthService authService;

  private static final String TEST_EMAIL = "test@example.com";
  private static final String TEST_PASSWORD = "password123";
  private static final String ENCODED_PASSWORD = "encodedPassword";
  private static final String ACCESS_TOKEN = "accessToken123";
  private static final String REFRESH_TOKEN = "refreshToken123";
  private static final UUID USER_ID = UUID.randomUUID();

  @BeforeEach
  void setUp() {
    lenient().when(emailValidator.normalize(anyString())).thenAnswer(i -> i.getArgument(0).toString().trim().toLowerCase());
  }

  @Test
  void register_WithValidData_ShouldCreateUserAndReturnAuthResponse() {
    // Given
    var registerRequest = new RegisterRequest(TEST_EMAIL, TEST_PASSWORD);
    when(userRepository.findByEmail(TEST_EMAIL)).thenReturn(Optional.empty());
    when(passwordEncoder.encode(TEST_PASSWORD)).thenReturn(ENCODED_PASSWORD);
    when(jwtTokenProvider.generateAccessToken(any(UUID.class))).thenReturn(ACCESS_TOKEN);
    when(jwtTokenProvider.generateRefreshToken(any(UUID.class))).thenReturn(REFRESH_TOKEN);
    when(userRepository.save(any(User.class))).thenAnswer(i -> i.getArgument(0));

    // When
    var result = authService.register(registerRequest, response);

    // Then
    assertNotNull(result);
    assertEquals(ACCESS_TOKEN, result.accessToken());
    assertEquals(TEST_EMAIL, result.user().email());
    verify(userRepository).save(any(User.class));
    verify(cookieManager).setCookie(eq(response), eq("refreshToken"), eq(REFRESH_TOKEN), anyInt());
  }

  @Test
  void register_WithExistingEmail_ShouldThrowEmailAlreadyInUseException() {
    // Given
    var registerRequest = new RegisterRequest(TEST_EMAIL, TEST_PASSWORD);
    var existingUser = new User();
    when(userRepository.findByEmail(TEST_EMAIL)).thenReturn(Optional.of(existingUser));

    // When & Then
    assertThrows(EmailAlreadyInUseException.class, () -> authService.register(registerRequest, response));
    verify(userRepository, never()).save(any(User.class));
    verify(cookieManager, never()).setCookie(any(), anyString(), anyString(), anyInt());
  }

  @Test
  void login_WithValidCredentials_ShouldReturnAuthResponse() {
    // Given
    var loginRequest = new LoginRequest(TEST_EMAIL, TEST_PASSWORD);
    var user = new User();
    user.id(USER_ID);
    user.email(TEST_EMAIL);
    user.password(ENCODED_PASSWORD);

    when(userRepository.findByEmail(TEST_EMAIL)).thenReturn(Optional.of(user));
    when(passwordEncoder.matches(TEST_PASSWORD, ENCODED_PASSWORD)).thenReturn(true);
    when(jwtTokenProvider.generateAccessToken(USER_ID)).thenReturn(ACCESS_TOKEN);
    when(jwtTokenProvider.generateRefreshToken(USER_ID)).thenReturn(REFRESH_TOKEN);

    // When
    var result = authService.login(loginRequest, response);

    // Then
    assertNotNull(result);
    assertEquals(ACCESS_TOKEN, result.accessToken());
    assertEquals(TEST_EMAIL, result.user().email());
    assertEquals(USER_ID, result.user().id());
    verify(cookieManager).setCookie(eq(response), eq("refreshToken"), eq(REFRESH_TOKEN), anyInt());
  }

  @Test
  void login_WithNonExistentEmail_ShouldThrowInvalidCredentialsException() {
    // Given
    var loginRequest = new LoginRequest(TEST_EMAIL, TEST_PASSWORD);
    when(userRepository.findByEmail(TEST_EMAIL)).thenReturn(Optional.empty());

    // When & Then
    assertThrows(InvalidCredentialsException.class, () -> authService.login(loginRequest, response));
    verify(passwordEncoder, never()).matches(anyString(), anyString());
    verify(cookieManager, never()).setCookie(any(), anyString(), anyString(), anyInt());
  }

  @Test
  void login_WithInvalidPassword_ShouldThrowInvalidCredentialsException() {
    // Given
    var loginRequest = new LoginRequest(TEST_EMAIL, TEST_PASSWORD);
    var user = new User();
    user.id(USER_ID);
    user.email(TEST_EMAIL);
    user.password(ENCODED_PASSWORD);

    when(userRepository.findByEmail(TEST_EMAIL)).thenReturn(Optional.of(user));
    when(passwordEncoder.matches(TEST_PASSWORD, ENCODED_PASSWORD)).thenReturn(false);

    // When & Then
    assertThrows(InvalidCredentialsException.class, () -> authService.login(loginRequest, response));
    verify(cookieManager, never()).setCookie(any(), anyString(), anyString(), anyInt());
  }

  @Test
  void refresh_WithValidToken_ShouldReturnNewAuthResponse() {
    // Given
    var user = new User();
    user.id(USER_ID);
    user.email(TEST_EMAIL);

    when(cookieManager.getCookie(request, "refreshToken")).thenReturn(Optional.of(REFRESH_TOKEN));
    when(jwtTokenProvider.validateToken(REFRESH_TOKEN)).thenReturn(true);
    when(jwtTokenProvider.getUserIdFromToken(REFRESH_TOKEN)).thenReturn(USER_ID);
    when(userRepository.findById(USER_ID)).thenReturn(Optional.of(user));
    when(jwtTokenProvider.generateAccessToken(USER_ID)).thenReturn(ACCESS_TOKEN);
    when(jwtTokenProvider.generateRefreshToken(USER_ID)).thenReturn(REFRESH_TOKEN);

    // When
    var result = authService.refresh(request, response);

    // Then
    assertNotNull(result);
    assertEquals(ACCESS_TOKEN, result.accessToken());
    assertEquals(TEST_EMAIL, result.user().email());
    verify(cookieManager).setCookie(eq(response), eq("refreshToken"), eq(REFRESH_TOKEN), anyInt());
  }

  @Test
  void refresh_WithoutRefreshToken_ShouldThrowInvalidRefreshTokenException() {
    // Given
    when(cookieManager.getCookie(request, "refreshToken")).thenReturn(Optional.empty());

    // When & Then
    assertThrows(InvalidRefreshTokenException.class, () -> authService.refresh(request, response));
    verify(jwtTokenProvider, never()).validateToken(anyString());
  }

  @Test
  void refresh_WithInvalidToken_ShouldThrowInvalidRefreshTokenException() {
    // Given
    when(cookieManager.getCookie(request, "refreshToken")).thenReturn(Optional.of(REFRESH_TOKEN));
    when(jwtTokenProvider.validateToken(REFRESH_TOKEN)).thenReturn(false);

    // When & Then
    assertThrows(InvalidRefreshTokenException.class, () -> authService.refresh(request, response));
    verify(userRepository, never()).findById(any());
  }

  @Test
  void refresh_WithNonExistentUser_ShouldThrowUserNotFoundException() {
    // Given
    when(cookieManager.getCookie(request, "refreshToken")).thenReturn(Optional.of(REFRESH_TOKEN));
    when(jwtTokenProvider.validateToken(REFRESH_TOKEN)).thenReturn(true);
    when(jwtTokenProvider.getUserIdFromToken(REFRESH_TOKEN)).thenReturn(USER_ID);
    when(userRepository.findById(USER_ID)).thenReturn(Optional.empty());

    // When & Then
    assertThrows(UserNotFoundException.class, () -> authService.refresh(request, response));
  }

  @Test
  void logout_ShouldClearRefreshTokenCookie() {
    // When
    authService.logout(response);

    // Then
    verify(cookieManager).clearCookie(response, "refreshToken");
  }
}
