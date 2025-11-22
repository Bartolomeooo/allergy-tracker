package org.example.allergytracker.domain.auth.dto;

public record AuthResponse(String accessToken, UserResponse user) {
}
