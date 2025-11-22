package org.example.allergytracker.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.UUID;

import static org.slf4j.LoggerFactory.getLogger;

@Component
public class JwtTokenProvider {

  private static final Logger LOGGER = getLogger(JwtTokenProvider.class);

  private final SecretKey secretKey;
  private final long accessTokenValidityMs;
  private final long refreshTokenValidityMs;

  public JwtTokenProvider(
          @Value("${jwt.secret}") String secret,
          @Value("${jwt.access-token-validity-ms}") long accessTokenValidityMs,
          @Value("${jwt.refresh-token-validity-ms}") long refreshTokenValidityMs
  ) {
    this.secretKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    this.accessTokenValidityMs = accessTokenValidityMs;
    this.refreshTokenValidityMs = refreshTokenValidityMs;
  }

  public String generateAccessToken(UUID userId) {
    return generateToken(userId, accessTokenValidityMs);
  }

  public String generateRefreshToken(UUID userId) {
    return generateToken(userId, refreshTokenValidityMs);
  }

  private String generateToken(UUID userId, long validityMs) {
    var now = new Date();
    var expiryDate = new Date(now.getTime() + validityMs);

    return Jwts.builder()
            .subject(userId.toString())
            .issuedAt(now)
            .expiration(expiryDate)
            .signWith(secretKey)
            .compact();
  }

  public UUID getUserIdFromToken(String token) {
    var claims = Jwts.parser()
            .verifyWith(secretKey)
            .build()
            .parseSignedClaims(token)
            .getPayload();

    return UUID.fromString(claims.getSubject());
  }

  public boolean validateToken(String token) {
    try {
      Jwts.parser()
              .verifyWith(secretKey)
              .build()
              .parseSignedClaims(token);
      return true;
    } catch (Exception e) {
      LOGGER.debug("Invalid JWT token: {}", e.getMessage());
      return false;
    }
  }
}
