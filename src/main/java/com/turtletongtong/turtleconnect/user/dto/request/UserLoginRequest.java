package com.turtletongtong.turtleconnect.user.dto.request;

/**
 * 로그인 요청 DTO.
 */
public record UserLoginRequest(
        String email,
        String password
) {}
