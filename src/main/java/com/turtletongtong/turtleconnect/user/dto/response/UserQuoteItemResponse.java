package com.turtletongtong.turtleconnect.user.dto.response;

import java.time.LocalDateTime;

public record UserQuoteItemResponse(
        Long routeMatchId,
        String agencyName,
        Integer totalCost,
        Integer pricePerPerson,
        LocalDateTime pickupTime,
        String description
) {}