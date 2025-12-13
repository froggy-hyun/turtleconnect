package com.turtletongtong.turtleconnect.route.dto.response;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record RoutePlanSummaryResponse(
        Long routeId,
        LocalDate date,
        Integer totalPassengerCount,
        Integer totalPrice,
        Integer pricePerPerson,
        Integer stopCount,
        LocalDateTime createdAt
) {
}