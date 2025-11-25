package com.turtletongtong.turtleconnect.tour.service;

import com.turtletongtong.turtleconnect.tour.dto.request.CreateTourRequest;
import com.turtletongtong.turtleconnect.tour.dto.response.MyTourRequestResponse;
import com.turtletongtong.turtleconnect.tour.dto.response.TourRequestResponse;

import java.util.List;

public interface TourRequestService {

    TourRequestResponse create(Long userId, CreateTourRequest request);

    void cancel(Long userId, Long tourRequestId);

    List<MyTourRequestResponse> getMyTourRequests(Long userId);
}
