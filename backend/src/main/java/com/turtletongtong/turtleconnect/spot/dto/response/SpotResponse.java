package com.turtletongtong.turtleconnect.spot.dto.response;

import com.turtletongtong.turtleconnect.spot.entity.Spot;
import com.turtletongtong.turtleconnect.spot.entity.SpotStatus;

public record SpotResponse(
        Long id,
        String name,
        String tag,
        String description,
        String location,
        String imageUrl,
        SpotStatus status,
        boolean hasDiscount,
        String discountDescription
) {
    public static SpotResponse from(Spot s) {
        return new SpotResponse(
                s.getId(),
                s.getName(),
                s.getTag(),
                s.getDescription(),
                s.getLocation(),
                s.getImageUrl(),
                s.getStatus(),
                s.isHasDiscount(),
                s.getDiscountDescription()
        );
    }
}
