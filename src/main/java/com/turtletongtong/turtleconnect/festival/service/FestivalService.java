package com.turtletongtong.turtleconnect.festival.service;

import com.turtletongtong.turtleconnect.festival.dto.request.FestivalCreateRequest;
import com.turtletongtong.turtleconnect.festival.dto.request.FestivalUpdateRequest;
import com.turtletongtong.turtleconnect.festival.dto.response.FestivalResponse;

import java.util.List;

public interface FestivalService {

    // Admin
    FestivalResponse createFestival(FestivalCreateRequest request);
    FestivalResponse updateFestival(Long id, FestivalUpdateRequest request);
    void deleteFestival(Long id);
    List<FestivalResponse> getAllFestivalsForAdmin();

    FestivalResponse toggleFestivalStatus(Long id);
    FestivalResponse toggleFestivalDiscount(Long id);

    // Public
    List<FestivalResponse> getActiveFestivals();
    FestivalResponse getFestival(Long id);
}
