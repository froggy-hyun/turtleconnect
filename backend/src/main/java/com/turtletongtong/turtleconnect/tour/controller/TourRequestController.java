package com.turtletongtong.turtleconnect.tour.controller;

import com.turtletongtong.turtleconnect.global.security.SecurityUtil;
import com.turtletongtong.turtleconnect.tour.dto.request.CreateTourRequest;
import com.turtletongtong.turtleconnect.tour.dto.response.MyTourRequestResponse;
import com.turtletongtong.turtleconnect.tour.dto.response.TourRequestResponse;
import com.turtletongtong.turtleconnect.tour.service.TourRequestService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tour-requests")
@RequiredArgsConstructor
public class TourRequestController {

    private final TourRequestService tourRequestService;

    @Operation(summary = "투어 예약 요청 (여러 날짜 동시 등록)")
    @PostMapping
    public List<TourRequestResponse> create(@Valid @RequestBody CreateTourRequest request) {
        Long userId = SecurityUtil.getCurrentUserId();
        return tourRequestService.create(userId, request);
    }

    @Operation(summary = "투어 예약 취소")
    @PostMapping("/{tourRequestId}/cancel")
    public String cancel(@PathVariable Long tourRequestId) {
        Long userId = SecurityUtil.getCurrentUserId();
        tourRequestService.cancel(userId, tourRequestId);
        return "예약이 취소되었습니다.";
    }

    @Operation(summary = "내 투어 예약 목록 조회")
    @GetMapping("/me")
    public List<MyTourRequestResponse> getMyTourRequests() {
        Long userId = SecurityUtil.getCurrentUserId();
        return tourRequestService.getMyTourRequests(userId);
    }
}
