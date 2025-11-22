package org.example.allergytracker.domain.auth.service;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.example.allergytracker.domain.auth.dto.AuthResponse;
import org.example.allergytracker.domain.auth.dto.LoginRequest;
import org.example.allergytracker.domain.auth.dto.RegisterRequest;
import org.example.allergytracker.domain.auth.dto.UserResponse;
import org.example.allergytracker.domain.auth.validator.EmailValidator;
import org.example.allergytracker.domain.user.model.User;
import org.example.allergytracker.domain.user.repository.UserRepository;
import org.example.allergytracker.exception.auth.EmailAlreadyInUseException;
import org.example.allergytracker.exception.auth.InvalidCredentialsException;
import org.example.allergytracker.exception.auth.InvalidRefreshTokenException;
import org.example.allergytracker.exception.auth.UserNotFoundException;
import org.example.allergytracker.security.JwtTokenProvider;
import org.example.allergytracker.security.cookie.CookieManager;
import org.slf4j.Logger;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

import static org.slf4j.LoggerFactory.getLogger;

@Service
@RequiredArgsConstructor
public class AuthService {

    private static final Logger LOGGER = getLogger(AuthService.class);
    private static final String REFRESH_TOKEN_COOKIE = "refreshToken";
    private static final int REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60; // 7 days

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final CookieManager cookieManager;
    private final EmailValidator emailValidator;

    public AuthResponse register(RegisterRequest request, HttpServletResponse response) {
        var email = emailValidator.normalize(request.email());

        if (userRepository.findByEmail(email).isPresent()) {
            LOGGER.warn("Registration attempt with already existing email: {}", email);
            throw new EmailAlreadyInUseException(email);
        }

        var user = new User();
        user.id(UUID.randomUUID());
        user.email(email);
        user.password(passwordEncoder.encode(request.password()));

        userRepository.save(user);
        LOGGER.info("New user registered: {}", email);

        var accessToken = jwtTokenProvider.generateAccessToken(user.id(), user.email());
        var refreshToken = jwtTokenProvider.generateRefreshToken(user.id(), user.email());

        cookieManager.setCookie(response, REFRESH_TOKEN_COOKIE, refreshToken, REFRESH_TOKEN_MAX_AGE);

        return new AuthResponse(accessToken, new UserResponse(user.id(), user.email()));
    }

    public AuthResponse login(LoginRequest request, HttpServletResponse response) {
        var email = emailValidator.normalize(request.email());

        var user = userRepository.findByEmail(email)
                .orElseThrow(() -> {
                    LOGGER.warn("Login attempt with non-existent email: {}", email);
                    return new InvalidCredentialsException();
                });

        if (!passwordEncoder.matches(request.password(), user.password())) {
            LOGGER.warn("Failed login attempt for email: {}", email);
            throw new InvalidCredentialsException();
        }

        LOGGER.info("User logged in: {}", email);

        var accessToken = jwtTokenProvider.generateAccessToken(user.id(), user.email());
        var refreshToken = jwtTokenProvider.generateRefreshToken(user.id(), user.email());

        cookieManager.setCookie(response, REFRESH_TOKEN_COOKIE, refreshToken, REFRESH_TOKEN_MAX_AGE);

        return new AuthResponse(accessToken, new UserResponse(user.id(), user.email()));
    }

    public AuthResponse refresh(HttpServletRequest request, HttpServletResponse response) {
        var refreshToken = cookieManager.getCookie(request, REFRESH_TOKEN_COOKIE)
                .orElseThrow(() -> {
                    LOGGER.warn("Refresh attempt without valid refresh token");
                    return new InvalidRefreshTokenException();
                });

        if (!jwtTokenProvider.validateToken(refreshToken)) {
            LOGGER.warn("Refresh attempt with invalid token");
            throw new InvalidRefreshTokenException();
        }

        var userId = jwtTokenProvider.getUserIdFromToken(refreshToken);
        var user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));

        LOGGER.debug("Token refreshed for user: {}", userId);

        var newAccessToken = jwtTokenProvider.generateAccessToken(user.id(), user.email());
        var newRefreshToken = jwtTokenProvider.generateRefreshToken(user.id(), user.email());

        cookieManager.setCookie(response, REFRESH_TOKEN_COOKIE, newRefreshToken, REFRESH_TOKEN_MAX_AGE);

        return new AuthResponse(newAccessToken, new UserResponse(user.id(), user.email()));
    }

    public void logout(HttpServletResponse response) {
        LOGGER.debug("User logged out");
        cookieManager.clearCookie(response, REFRESH_TOKEN_COOKIE);
    }
}
