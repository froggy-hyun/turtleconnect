package com.turtletongtong.turtleconnect.user.dto.request;

import com.turtletongtong.turtleconnect.user.entity.Gender;
import com.turtletongtong.turtleconnect.user.entity.Role;

import java.time.LocalDate;

/**
 * 회원가입 요청 DTO.
 */
public record UserSignUpRequest(
        String email,
        String password,
        String name,
        String phone,
        Gender gender,
        LocalDate birthDate,
        Role role
) {}
