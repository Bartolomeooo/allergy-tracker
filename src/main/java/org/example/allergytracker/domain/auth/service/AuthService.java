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
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private static final String REFRESH_TOKEN_COOKIE = "refreshToken";
    private static final int REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60; // 7 days in seconds

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final CookieManager cookieManager;
    private final EmailValidator emailValidator;

    public AuthResponse register(RegisterRequest request, HttpServletResponse response) {
        var email = emailValidator.normalize(request.email());

        if (userRepository.findByEmail(email).isPresent()) {
            throw new EmailAlreadyInUseException(email);
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
                .orElseThrow(InvalidCredentialsException::new);

        if (!passwordEncoder.matches(request.password(), user.password())) {
            throw new InvalidCredentialsException();
        }

        var accessToken = jwtTokenProvider.generateAccessToken(user.id());
        var refreshToken = jwtTokenProvider.generateRefreshToken(user.id());

        cookieManager.setCookie(response, REFRESH_TOKEN_COOKIE, refreshToken, REFRESH_TOKEN_MAX_AGE);

        return new AuthResponse(accessToken, new UserResponse(user.id(), user.email()));
    }

    public AuthResponse refresh(HttpServletRequest request, HttpServletResponse response) {
        var refreshToken = cookieManager.getCookie(request, REFRESH_TOKEN_COOKIE)
                .orElseThrow(InvalidRefreshTokenException::new);

        if (!jwtTokenProvider.validateToken(refreshToken)) {
            throw new InvalidRefreshTokenException();
        }

        var userId = jwtTokenProvider.getUserIdFromToken(refreshToken);
        var user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));

        var newAccessToken = jwtTokenProvider.generateAccessToken(user.id());
        var newRefreshToken = jwtTokenProvider.generateRefreshToken(user.id());

        cookieManager.setCookie(response, REFRESH_TOKEN_COOKIE, newRefreshToken, REFRESH_TOKEN_MAX_AGE);

        return new AuthResponse(newAccessToken, new UserResponse(user.id(), user.email()));
    }

    public void logout(HttpServletResponse response) {
        cookieManager.clearCookie(response, REFRESH_TOKEN_COOKIE);
    }
}
