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
import org.example.allergytracker.security.JwtTokenProvider;
import org.example.allergytracker.security.cookie.CookieManager;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

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
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already in use");
        }

        var user = new User();
        user.id(UUID.randomUUID());
        user.email(email);
        user.password(passwordEncoder.encode(request.password()));

        userRepository.save(user);

        var accessToken = jwtTokenProvider.generateAccessToken(user.id());
        var refreshToken = jwtTokenProvider.generateRefreshToken(user.id());

        cookieManager.setCookie(response, REFRESH_TOKEN_COOKIE, refreshToken, REFRESH_TOKEN_MAX_AGE);

        return new AuthResponse(accessToken, new UserResponse(user.id(), user.email()));
    }

    public AuthResponse login(LoginRequest request, HttpServletResponse response) {
        var email = emailValidator.normalize(request.email());

        var user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials"));

        if (!passwordEncoder.matches(request.password(), user.password())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
        }

        var accessToken = jwtTokenProvider.generateAccessToken(user.id());
        var refreshToken = jwtTokenProvider.generateRefreshToken(user.id());

        cookieManager.setCookie(response, REFRESH_TOKEN_COOKIE, refreshToken, REFRESH_TOKEN_MAX_AGE);

        return new AuthResponse(accessToken, new UserResponse(user.id(), user.email()));
    }

    public AuthResponse refresh(HttpServletRequest request, HttpServletResponse response) {
        var refreshToken = cookieManager.getCookie(request, REFRESH_TOKEN_COOKIE)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid refresh token"));

        if (!jwtTokenProvider.validateToken(refreshToken)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid refresh token");
        }

        var userId = jwtTokenProvider.getUserIdFromToken(refreshToken);
        var user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));

        var newAccessToken = jwtTokenProvider.generateAccessToken(user.id());
        var newRefreshToken = jwtTokenProvider.generateRefreshToken(user.id());

        cookieManager.setCookie(response, REFRESH_TOKEN_COOKIE, newRefreshToken, REFRESH_TOKEN_MAX_AGE);

        return new AuthResponse(newAccessToken, new UserResponse(user.id(), user.email()));
    }

    public void logout(HttpServletResponse response) {
        cookieManager.clearCookie(response, REFRESH_TOKEN_COOKIE);
    }
}
