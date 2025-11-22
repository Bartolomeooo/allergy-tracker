package org.example.allergytracker.domain.auth.service;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.example.allergytracker.domain.auth.dto.*;
import org.example.allergytracker.domain.user.model.User;
import org.example.allergytracker.domain.user.repository.UserRepository;
import org.example.allergytracker.security.JwtTokenProvider;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Arrays;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

  private static final String REFRESH_TOKEN_COOKIE = "refreshToken";
  private static final int REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60; // 7 days
  private static final String COOKIE_PATH = "/";
  private static final String EMPTY_COOKIE_VALUE = "";

  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;
  private final JwtTokenProvider jwtTokenProvider;

  public AuthResponse register(RegisterRequest request, HttpServletResponse response) {
    var email = request.email().trim().toLowerCase();

    if (userRepository.findByEmail(email).isPresent()) {
      throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already in use");
    }

    var user = new User();
    user.id(UUID.randomUUID());
    user.email(email);
    user.password(passwordEncoder.encode(request.password()));

    userRepository.save(user);

    var accessToken = jwtTokenProvider.generateAccessToken(user.id());
    var refreshToken = jwtTokenProvider.generateRefreshToken(user.id());

    setRefreshTokenCookie(response, refreshToken);

    return new AuthResponse(accessToken, new UserResponse(user.id(), user.email()));
  }

  public AuthResponse login(LoginRequest request, HttpServletResponse response) {
    var email = request.email().trim().toLowerCase();

    var user = userRepository.findByEmail(email)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials"));

    if (!passwordEncoder.matches(request.password(), user.password())) {
      throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
    }

    var accessToken = jwtTokenProvider.generateAccessToken(user.id());
    var refreshToken = jwtTokenProvider.generateRefreshToken(user.id());

    setRefreshTokenCookie(response, refreshToken);

    return new AuthResponse(accessToken, new UserResponse(user.id(), user.email()));
  }

  public AuthResponse refresh(HttpServletRequest request, HttpServletResponse response) {
    var refreshToken = getRefreshTokenFromCookies(request);

    if (refreshToken == null || !jwtTokenProvider.validateToken(refreshToken)) {
      throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid refresh token");
    }

    var userId = jwtTokenProvider.getUserIdFromToken(refreshToken);
    var user = userRepository.findById(userId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));

    var newAccessToken = jwtTokenProvider.generateAccessToken(user.id());
    var newRefreshToken = jwtTokenProvider.generateRefreshToken(user.id());

    setRefreshTokenCookie(response, newRefreshToken);

    return new AuthResponse(newAccessToken, new UserResponse(user.id(), user.email()));
  }

  public void logout(HttpServletResponse response) {
    clearRefreshTokenCookie(response);
  }

  private void setRefreshTokenCookie(HttpServletResponse response, String refreshToken) {
    var cookie = new Cookie(REFRESH_TOKEN_COOKIE, refreshToken);
    cookie.setHttpOnly(true);
    cookie.setSecure(false);
    cookie.setPath(COOKIE_PATH);
    cookie.setMaxAge(REFRESH_TOKEN_MAX_AGE);
    response.addCookie(cookie);
  }

  private void clearRefreshTokenCookie(HttpServletResponse response) {
    var cookie = new Cookie(REFRESH_TOKEN_COOKIE, EMPTY_COOKIE_VALUE);
    cookie.setHttpOnly(true);
    cookie.setSecure(false);
    cookie.setPath(COOKIE_PATH);
    cookie.setMaxAge(0);
    response.addCookie(cookie);
  }

  private String getRefreshTokenFromCookies(HttpServletRequest request) {
    var cookies = request.getCookies();
    if (cookies == null) {
      return null;
    }

    return Arrays.stream(cookies)
            .filter(cookie -> REFRESH_TOKEN_COOKIE.equals(cookie.getName()))
            .map(Cookie::getValue)
            .findFirst()
            .orElse(null);
  }
}
