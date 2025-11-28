package com.turtletongtong.turtleconnect.tour.service;

import com.turtletongtong.turtleconnect.tour.dto.request.CreateTourRequest;
import com.turtletongtong.turtleconnect.tour.dto.response.*;

import java.time.LocalDate;
import java.util.List;

public interface TourRequestService {

    TourRequestResponse create(Long userId, CreateTourRequest request);

    void cancel(Long userId, Long tourRequestId);

    List<MyTourRequestResponse> getMyTourRequests(Long userId);

    List<TourRequestDateCountResponse> getDateCounts(int year, int month);

    TourRequestSummaryResponse getSummary(LocalDate date);

    List<TourRequestLocationSummaryResponse> getLocationSummary(LocalDate date);
}
