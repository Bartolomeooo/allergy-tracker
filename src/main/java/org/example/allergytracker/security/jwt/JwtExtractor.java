package org.example.allergytracker.security.jwt;

import jakarta.servlet.http.HttpServletRequest;

import java.util.Optional;

public interface JwtExtractor {
  Optional<String> extractToken(HttpServletRequest request);
}
