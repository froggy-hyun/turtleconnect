package com.turtletongtong.turtleconnect.spot.service;

import com.turtletongtong.turtleconnect.spot.dto.request.SpotCreateRequest;
import com.turtletongtong.turtleconnect.spot.dto.request.SpotUpdateRequest;
import com.turtletongtong.turtleconnect.spot.dto.response.SpotResponse;

import java.util.List;

public interface SpotService {

    // Admin
    SpotResponse createSpot(SpotCreateRequest request);
    SpotResponse updateSpot(Long id, SpotUpdateRequest request);
    void deleteSpot(Long id);
    List<SpotResponse> getAllSpotsForAdmin();

    SpotResponse toggleSpotStatus(Long id);
    SpotResponse toggleSpotDiscount(Long id);

    // Public
    List<SpotResponse> getActiveSpots();
    SpotResponse getSpot(Long id);
}
