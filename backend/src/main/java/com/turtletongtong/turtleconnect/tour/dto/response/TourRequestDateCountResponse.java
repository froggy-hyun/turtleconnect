package com.turtletongtong.turtleconnect.tour.dto.response;

import java.time.LocalDate;

/**
 * 월 단위 날짜별 요청 건수 (탭 정보)
 */
public record TourRequestDateCountResponse(
        LocalDate date,
        long requestCount
) {}
