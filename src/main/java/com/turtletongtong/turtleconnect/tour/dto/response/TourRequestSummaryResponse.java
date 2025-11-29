package com.turtletongtong.turtleconnect.tour.dto.response;

/**
 * 특정 날짜 전체 수요 요약
 */
public record TourRequestSummaryResponse(
        long totalRequests,
        long totalPeople
) {}
