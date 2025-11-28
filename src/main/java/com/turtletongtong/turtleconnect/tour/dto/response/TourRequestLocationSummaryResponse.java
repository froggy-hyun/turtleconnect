package com.turtletongtong.turtleconnect.tour.dto.response;

/**
 * 특정 날짜, 출발지(location)별 수요 요약
 */
public record TourRequestLocationSummaryResponse(
        Long locationId,
        String locationName,
        long requestCount,
        long totalPeople
) {}
