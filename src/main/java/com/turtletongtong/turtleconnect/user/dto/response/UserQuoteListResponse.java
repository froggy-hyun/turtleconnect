package com.turtletongtong.turtleconnect.user.dto.response;

import com.turtletongtong.turtleconnect.tour.entity.TourRequestStatus;
import com.turtletongtong.turtleconnect.user.dto.response.UserQuoteItemResponse;

import java.time.LocalDate;
import java.util.List;

public record UserQuoteListResponse(
        Long tourRequestId,
        LocalDate startDate,
        LocalDate endDate,
        String locationName,
        Integer participantCount,
        TourRequestStatus status,
        List<UserQuoteItemResponse> quotes
) {}