package com.turtletongtong.turtleconnect.route.service;

import com.turtletongtong.turtleconnect.route.dto.request.CreateRoutePlanRequest;
import com.turtletongtong.turtleconnect.route.dto.response.RoutePlanResponse;

public interface RoutePlanService {

    RoutePlanResponse createRoutePlan(Long agencyId, CreateRoutePlanRequest request);
}
