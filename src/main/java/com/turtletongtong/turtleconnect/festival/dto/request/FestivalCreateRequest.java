package com.turtletongtong.turtleconnect.festival.dto.request;

import com.turtletongtong.turtleconnect.festival.entity.FestivalStatus;

import java.time.LocalDate;

public record FestivalCreateRequest(
        String name,
        String description,
        String location,
        LocalDate startDate,
        LocalDate endDate,
        String specialEvent,
        String mainPrograms,
        String imageUrl,
        FestivalStatus status,
        boolean hasDiscount,
        String discountDescription
) {}
