package com.turtletongtong.turtleconnect.route.dto.response;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public record RoutePlanResponse(
        Long routeId,
        LocalDate date,
        Integer totalPassengerCount,
        Integer totalPrice,
        Integer pricePerPerson,
        List<RoutePlanStop> stops
) {
    public record RoutePlanStop(
            Long locationId,
            String locationName,
            Integer stopOrder,
            LocalDateTime pickupTime
    ) {}
}
