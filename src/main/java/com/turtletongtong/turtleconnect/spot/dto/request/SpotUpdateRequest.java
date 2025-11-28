package com.turtletongtong.turtleconnect.spot.dto.request;

import com.turtletongtong.turtleconnect.spot.entity.SpotStatus;

public record SpotUpdateRequest(
        String name,
        String tag,
        String description,
        String location,
        String imageUrl,
        SpotStatus status,
        boolean hasDiscount,
        String discountDescription
) {}
