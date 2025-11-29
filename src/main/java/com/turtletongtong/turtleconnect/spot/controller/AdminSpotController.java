package com.turtletongtong.turtleconnect.spot.controller;

import com.turtletongtong.turtleconnect.spot.dto.request.SpotCreateRequest;
import com.turtletongtong.turtleconnect.spot.dto.request.SpotUpdateRequest;
import com.turtletongtong.turtleconnect.spot.dto.response.SpotResponse;
import com.turtletongtong.turtleconnect.spot.service.SpotService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/spots")
@Tag(name = "Admin - Spot", description = "관리자용 관광지 관리 API")
public class AdminSpotController {

    private final SpotService spotService;

    @Operation(summary = "관광지 생성")
    @PostMapping
    public SpotResponse create(@RequestBody SpotCreateRequest request) {
        return spotService.createSpot(request);
    }

    @Operation(summary = "관광지 수정")
    @PutMapping("/{id}")
    public SpotResponse update(
            @PathVariable Long id,
            @RequestBody SpotUpdateRequest request
    ) {
        return spotService.updateSpot(id, request);
    }

    @Operation(summary = "관광지 삭제")
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        spotService.deleteSpot(id);
    }

    @Operation(summary = "관광지 목록 조회 (관리자용)")
    @GetMapping
    public List<SpotResponse> getAll() {
        return spotService.getAllSpotsForAdmin();
    }

    @Operation(summary = "관광지 상세 조회 (관리자용)")
    @GetMapping("/{id}")
    public SpotResponse get(@PathVariable Long id) {
        return spotService.getSpot(id);
    }

    @Operation(summary = "관광지 상태 토글 (ACTIVE <-> INACTIVE)")
    @PatchMapping("/{id}/toggle-status")
    public SpotResponse toggleStatus(@PathVariable Long id) {
        return spotService.toggleSpotStatus(id);
    }

    @Operation(summary = "관광지 패스권 할인 토글 (ON/OFF)")
    @PatchMapping("/{id}/toggle-discount")
    public SpotResponse toggleDiscount(@PathVariable Long id) {
        return spotService.toggleSpotDiscount(id);
    }
}
