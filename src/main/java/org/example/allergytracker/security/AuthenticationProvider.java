package org.example.allergytracker.security;

import org.springframework.security.core.context.SecurityContextHolder;

import java.util.UUID;

public class AuthenticationProvider {

  private AuthenticationProvider() {
    throw new UnsupportedOperationException("Utility class");
  }

  public static UUID getCurrentUserId() {
    var authentication = SecurityContextHolder.getContext().getAuthentication();
    if (authentication == null || !(authentication.getPrincipal() instanceof UUID)) {
      throw new IllegalStateException("No authenticated user found");
    }
    return (UUID) authentication.getPrincipal();
  }
}
