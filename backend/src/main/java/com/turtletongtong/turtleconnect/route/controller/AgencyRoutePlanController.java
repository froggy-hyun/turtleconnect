package com.turtletongtong.turtleconnect.route.controller;

import com.turtletongtong.turtleconnect.global.security.SecurityUtil;
import com.turtletongtong.turtleconnect.route.dto.request.CreateRoutePlanRequest;
import com.turtletongtong.turtleconnect.route.dto.response.RoutePlanResponse;
import com.turtletongtong.turtleconnect.route.dto.response.RoutePlanSummaryResponse;
import com.turtletongtong.turtleconnect.route.service.RoutePlanService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/agency/routes")
@RequiredArgsConstructor
@Tag(name = "Agency - Route Plan", description = "여행사 배차 계획 세우기 API")
@PreAuthorize("hasRole('AGENCY')")
public class AgencyRoutePlanController {

    private final RoutePlanService routePlanService;

    @Operation(
            summary = "배차 계획 생성",
            description = """
                    선택된 날짜/픽업 구역/탑승 시간/총 금액을 기반으로 배차 계획(버스 노선)을 생성.
                    - stops.pickupTime 은 HH:mm 형식. (예: 09:30)
                    - totalPassengerCount 는 프론트에서 계산한 총 인원 수.
                    - totalPrice / totalPassengerCount 로 인당 요금을 계산하여 bus_route.price_per_person 에 저장.
                    """
    )
    @PostMapping
    public RoutePlanResponse createRoutePlan(@RequestBody CreateRoutePlanRequest request) {

        Long agencyId = SecurityUtil.getCurrentUserId();
        return routePlanService.createRoutePlan(agencyId, request);
    }

    @Operation(
            summary = "배차 계획 리스트 조회",
            description = """
                    여행사가 생성한 배차 계획 목록을 조회합니다.
                    (BusRoute에 date 컬럼이 없으므로, 첫 정차역 pickupTime의 날짜를 배차 날짜로 사용합니다.)
                    - date 파라미터를 주면 해당 날짜만 필터링합니다. (옵션)
                    """
    )
    @GetMapping
    public List<RoutePlanSummaryResponse> getRoutePlans(
            @RequestParam(required = false) LocalDate date
    )
    {
        Long agencyId = SecurityUtil.getCurrentUserId();
        return routePlanService.getRoutePlans(agencyId, date);
    }

    @Operation(
            summary = "배차 계획 상세 조회",
            description = """
                    routeId로 배차 계획 상세(정차역 포함)를 조회합니다.
                    (BusRoute에 date 컬럼이 없으므로, 첫 정차역 pickupTime의 날짜를 배차 날짜로 사용합니다.)
                    """
    )
    @GetMapping("/{routeId}")
    public RoutePlanResponse getRoutePlan(@PathVariable Long routeId)
    {
        Long agencyId = SecurityUtil.getCurrentUserId();
        return routePlanService.getRoutePlan(agencyId, routeId);
    }
}
