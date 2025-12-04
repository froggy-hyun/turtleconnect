package com.turtletongtong.turtleconnect.route.dto.request;

import java.time.LocalDate;
import java.util.List;

public record CreateRoutePlanRequest(
        LocalDate date,                  // 배차 날짜 (예: 2025-12-03)
        Integer totalPassengerCount,     // (옵션) 프론트가 계산한 총 인원 수
        Integer totalCost,               // 총 금액 (원)
        List<StopRequest> stops,         // 픽업 역 + 시간 목록
        String note                      // 전달 사항(메모)
) {
    public record StopRequest(
            Long locationId,            // 출발지 location id
            String pickupTime           // "HH:mm" 형식 (예: "09:30")
    ) {}
}
