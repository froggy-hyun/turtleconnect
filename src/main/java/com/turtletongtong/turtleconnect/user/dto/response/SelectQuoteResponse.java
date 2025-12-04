package com.turtletongtong.turtleconnect.user.dto.response;

import com.turtletongtong.turtleconnect.tour.entity.TourRequestStatus;

public record SelectQuoteResponse(
        Long tourRequestId,
        Long routeMatchId,
        TourRequestStatus status,
        String agencyName,
        Integer pricePerPerson,
        Integer totalCost
) {}
