package com.turtletongtong.turtleconnect.route.dto.request;

import java.time.LocalDate;
import java.util.List;

public record CreateRoutePlanRequest(
        Long tourRequestId,
        LocalDate date,                    // 배차 날짜 (예: 2025-11-20)
        Integer totalPassengerCount,       // 총 인원 (프론트 계산값)
        Integer totalCost,                // 총 금액 (원)
        List<StopRequest> stops,           // 역 + 시간 목록
        String note                        // 전달 사항(메모)
) {

    public record StopRequest(
            Long locationId,              // 출발지 location id
            String pickupTime             // "HH:mm" 형식 (예: "10:00")
    ) {}
}
