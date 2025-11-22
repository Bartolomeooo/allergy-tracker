package org.example.allergytracker.domain.auth.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.example.allergytracker.domain.auth.dto.*;
import org.example.allergytracker.domain.auth.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping(AuthController.AUTH_API_PATH)
@RequiredArgsConstructor
public class AuthController {

  static final String AUTH_API_PATH = "/auth";
  private static final String REGISTER_PATH = "/register";
  private static final String LOGIN_PATH = "/login";
  private static final String REFRESH_PATH = "/refresh";
  private static final String LOGOUT_PATH = "/logout";
  private static final String ACCESS_TOKEN_KEY = "accessToken";

  private final AuthService authService;

  @PostMapping(REGISTER_PATH)
  @ResponseStatus(HttpStatus.CREATED)
  public AuthResponse register(@RequestBody RegisterRequest request, HttpServletResponse response) {
    return authService.register(request, response);
  }

  @PostMapping(LOGIN_PATH)
  public AuthResponse login(@RequestBody LoginRequest request, HttpServletResponse response) {
    return authService.login(request, response);
  }

  @PostMapping(REFRESH_PATH)
  public Map<String, String> refresh(HttpServletRequest request, HttpServletResponse response) {
    var authResponse = authService.refresh(request, response);
    return Map.of(ACCESS_TOKEN_KEY, authResponse.accessToken());
  }

  @PostMapping(LOGOUT_PATH)
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void logout(HttpServletResponse response) {
    authService.logout(response);
  }
}
