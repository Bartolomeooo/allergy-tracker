package org.example.allergytracker.security.cookie;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.Optional;

@Component
public class DefaultCookieManager implements CookieManager {

  private static final String COOKIE_PATH = "/";
  private static final String EMPTY_COOKIE_VALUE = "";

  @Override
  public void setCookie(HttpServletResponse response, String name, String value, int maxAge) {
    var cookie = new Cookie(name, value);
    cookie.setHttpOnly(true);
    cookie.setSecure(false);
    cookie.setPath(COOKIE_PATH);
    cookie.setMaxAge(maxAge);
    response.addCookie(cookie);
  }

  @Override
  public void clearCookie(HttpServletResponse response, String name) {
    var cookie = new Cookie(name, EMPTY_COOKIE_VALUE);
    cookie.setHttpOnly(true);
    cookie.setSecure(false);
    cookie.setPath(COOKIE_PATH);
    cookie.setMaxAge(0);
    response.addCookie(cookie);
  }

  @Override
  public Optional<String> getCookie(HttpServletRequest request, String name) {
    var cookies = request.getCookies();
    if (cookies == null) {
      return Optional.empty();
    }

    return Arrays.stream(cookies)
            .filter(cookie -> name.equals(cookie.getName()))
            .map(Cookie::getValue)
            .findFirst();
  }
}
