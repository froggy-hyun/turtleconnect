package com.turtletongtong.turtleconnect.tour.dto.response;

import com.turtletongtong.turtleconnect.tour.entity.TourRequestStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * "내 예약" 카드 한 장에 해당하는 데이터.
 */
public record MyTourRequestResponse(
        Long id,
        String locationName,
        String routeName,          // 매칭된 노선 이름 (WAITING이면 null)
        LocalDate startDate,
        LocalDate endDate,
        LocalDateTime pickupTime,  // 탑승 시간 (WAITING이면 null)
        Integer participantCount,
        Integer pricePerPerson,    // 1인당 가격 (MATCHED일 때만)
        Integer totalPrice,        // 총 금액 (MATCHED일 때만)
        TourRequestStatus status,
        LocalDateTime createdAt
) {}
