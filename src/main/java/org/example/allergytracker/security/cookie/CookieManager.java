package org.example.allergytracker.security.cookie;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.util.Optional;

public interface CookieManager {
  void setCookie(HttpServletResponse response, String name, String value, int maxAge);

  void clearCookie(HttpServletResponse response, String name);

  Optional<String> getCookie(HttpServletRequest request, String name);
}
