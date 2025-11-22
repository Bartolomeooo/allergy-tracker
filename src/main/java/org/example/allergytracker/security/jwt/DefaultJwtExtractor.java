package org.example.allergytracker.security.jwt;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.util.Optional;

@Component
public class DefaultJwtExtractor implements JwtExtractor {

  private static final String AUTHORIZATION_HEADER = "Authorization";
  private static final String BEARER_PREFIX = "Bearer ";
  private static final int BEARER_PREFIX_LENGTH = 7;

  @Override
  public Optional<String> extractToken(HttpServletRequest request) {
    var bearerToken = request.getHeader(AUTHORIZATION_HEADER);
    if (StringUtils.hasText(bearerToken) && bearerToken.startsWith(BEARER_PREFIX)) {
      return Optional.of(bearerToken.substring(BEARER_PREFIX_LENGTH));
    }
    return Optional.empty();
  }
}
