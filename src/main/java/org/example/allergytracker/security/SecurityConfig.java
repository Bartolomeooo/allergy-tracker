package org.example.allergytracker.security;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

  private static final String AUTH_LOGIN_PATH = "/auth/login";
  private static final String AUTH_REGISTER_PATH = "/auth/register";
  private static final String AUTH_REFRESH_PATH = "/auth/refresh";
  private static final String CORS_PATTERN = "/**";
  private static final String SET_COOKIE_HEADER = "Set-Cookie";
  private static final String WILDCARD = "*";

  private final JwtAuthenticationFilter jwtAuthenticationFilter;

  @Value("${cors.allowed-origins}")
  private String allowedOrigins;

  @Value("${security.password.pepper}")
  private String passwordPepper;

  @Bean
  public PasswordEncoder passwordEncoder() {
    return new PepperedPasswordEncoder(passwordPepper);
  }

  @Bean
  public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(AbstractHttpConfigurer::disable)
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                    .requestMatchers(AUTH_LOGIN_PATH, AUTH_REGISTER_PATH, AUTH_REFRESH_PATH).permitAll()
                    .requestMatchers(HttpMethod.OPTIONS, CORS_PATTERN).permitAll()
                    .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

    return http.build();
  }

  @Bean
  public CorsConfigurationSource corsConfigurationSource() {
    var configuration = new CorsConfiguration();
    configuration.setAllowedOrigins(Arrays.asList(allowedOrigins.split(",")));
    configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
    configuration.setAllowedHeaders(List.of(WILDCARD));
    configuration.setAllowCredentials(true);
    configuration.setExposedHeaders(List.of(SET_COOKIE_HEADER));

    var source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration(CORS_PATTERN, configuration);
    return source;
  }
}
