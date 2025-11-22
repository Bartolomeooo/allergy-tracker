package org.example.allergytracker.security.cookie;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class DefaultCookieManagerTest {

  @Mock
  private HttpServletRequest request;

  @Mock
  private HttpServletResponse response;

  private DefaultCookieManager cookieManager;

  @BeforeEach
  void setUp() {
    cookieManager = new DefaultCookieManager();
  }

  @Test
  void setCookie_ShouldCreateAndAddCookie() {
    // Given
    var name = "testCookie";
    var value = "testValue";
    var maxAge = 3600;
    var cookieCaptor = ArgumentCaptor.forClass(Cookie.class);

    // When
    cookieManager.setCookie(response, name, value, maxAge);

    // Then
    verify(response).addCookie(cookieCaptor.capture());
    var cookie = cookieCaptor.getValue();
    assertEquals(name, cookie.getName());
    assertEquals(value, cookie.getValue());
    assertEquals(maxAge, cookie.getMaxAge());
    assertTrue(cookie.isHttpOnly());
    assertFalse(cookie.getSecure());
    assertEquals("/", cookie.getPath());
  }

  @Test
  void clearCookie_ShouldSetMaxAgeToZero() {
    // Given
    var name = "testCookie";
    var cookieCaptor = ArgumentCaptor.forClass(Cookie.class);

    // When
    cookieManager.clearCookie(response, name);

    // Then
    verify(response).addCookie(cookieCaptor.capture());
    Cookie cookie = cookieCaptor.getValue();
    assertEquals(name, cookie.getName());
    assertEquals("", cookie.getValue());
    assertEquals(0, cookie.getMaxAge());
  }

  @Test
  void getCookie_WhenCookieExists_ShouldReturnValue() {
    // Given
    String name = "testCookie";
    String value = "testValue";
    Cookie cookie = new Cookie(name, value);
    when(request.getCookies()).thenReturn(new Cookie[]{cookie});

    // When
    Optional<String> result = cookieManager.getCookie(request, name);

    // Then
    assertTrue(result.isPresent());
    assertEquals(value, result.get());
  }

  @Test
  void getCookie_WhenCookieDoesNotExist_ShouldReturnEmpty() {
    // Given
    String name = "testCookie";
    Cookie otherCookie = new Cookie("otherCookie", "otherValue");
    when(request.getCookies()).thenReturn(new Cookie[]{otherCookie});

    // When
    Optional<String> result = cookieManager.getCookie(request, name);

    // Then
    assertTrue(result.isEmpty());
  }

  @Test
  void getCookie_WhenNoCookies_ShouldReturnEmpty() {
    // Given
    when(request.getCookies()).thenReturn(null);

    // When
    Optional<String> result = cookieManager.getCookie(request, "anyCookie");

    // Then
    assertTrue(result.isEmpty());
  }

  @Test
  void getCookie_WithEmptyCookieArray_ShouldReturnEmpty() {
    // Given
    when(request.getCookies()).thenReturn(new Cookie[]{});

    // When
    Optional<String> result = cookieManager.getCookie(request, "anyCookie");

    // Then
    assertTrue(result.isEmpty());
  }

  @Test
  void getCookie_WithMultipleCookies_ShouldReturnCorrectOne() {
    // Given
    String targetName = "targetCookie";
    String targetValue = "targetValue";
    Cookie[] cookies = {
            new Cookie("cookie1", "value1"),
            new Cookie(targetName, targetValue),
            new Cookie("cookie2", "value2")
    };
    when(request.getCookies()).thenReturn(cookies);

    // When
    Optional<String> result = cookieManager.getCookie(request, targetName);

    // Then
    assertTrue(result.isPresent());
    assertEquals(targetValue, result.get());
  }
}
