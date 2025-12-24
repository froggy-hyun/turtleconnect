package com.turtletongtong.turtleconnect.user.dto.response;

/**
 * 로그인 응답 DTO.
 * Access Token과 Refresh Token을 반환한다.
 */
public record UserLoginResponse(
        String accessToken,
        String refreshToken,
        Long userId,
        String role
) {}
