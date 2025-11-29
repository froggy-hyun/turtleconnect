package com.turtletongtong.turtleconnect.festival.dto.response;

import com.turtletongtong.turtleconnect.festival.entity.Festival;
import com.turtletongtong.turtleconnect.festival.entity.FestivalStatus;

import java.time.LocalDate;

public record FestivalResponse(
        Long id,
        String name,
        String description,
        String location,
        LocalDate startDate,
        LocalDate endDate,
        String specialEvent,
        String mainPrograms,
        String imageUrl,
        FestivalStatus status,
        boolean hasDiscount,
        String discountDescription
) {
    public static FestivalResponse from(Festival f) {
        return new FestivalResponse(
                f.getId(),
                f.getName(),
                f.getDescription(),
                f.getLocation(),
                f.getStartDate(),
                f.getEndDate(),
                f.getSpecialEvent(),
                f.getMainPrograms(),
                f.getImageUrl(),
                f.getStatus(),
                f.isHasDiscount(),
                f.getDiscountDescription()
        );
    }
}
