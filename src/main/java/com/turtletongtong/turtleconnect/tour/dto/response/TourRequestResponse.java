package com.turtletongtong.turtleconnect.tour.dto.response;

import com.turtletongtong.turtleconnect.tour.entity.TourRequestStatus;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Schema(description = "투어 예약 응답 DTO")
public record TourRequestResponse(

        Long id,
        TourRequestStatus status,
        Long locationId,
        String locationName,
        LocalDate startDate,
        LocalDate endDate,
        Integer participantCount,
        LocalDateTime createdAt
) {}
