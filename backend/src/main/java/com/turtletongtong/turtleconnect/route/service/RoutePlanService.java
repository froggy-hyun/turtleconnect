package com.turtletongtong.turtleconnect.route.service;

import com.turtletongtong.turtleconnect.route.dto.request.CreateRoutePlanRequest;
import com.turtletongtong.turtleconnect.route.dto.response.RoutePlanResponse;
import com.turtletongtong.turtleconnect.route.dto.response.RoutePlanSummaryResponse;

import java.time.LocalDate;
import java.util.List;

public interface RoutePlanService {

    RoutePlanResponse createRoutePlan(Long agencyId, CreateRoutePlanRequest request);

    List<RoutePlanSummaryResponse> getRoutePlans(Long agencyId, LocalDate dateFilter);

    RoutePlanResponse getRoutePlan(Long agencyId, Long routeId);
}
