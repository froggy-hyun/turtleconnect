package com.turtletongtong.turtleconnect.festival.controller;

import com.turtletongtong.turtleconnect.festival.dto.request.FestivalCreateRequest;
import com.turtletongtong.turtleconnect.festival.dto.request.FestivalUpdateRequest;
import com.turtletongtong.turtleconnect.festival.dto.response.FestivalResponse;
import com.turtletongtong.turtleconnect.festival.service.FestivalService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/festivals")
@Tag(name = "Admin - Festival", description = "관리자용 축제 관리 API")
public class AdminFestivalController {

    private final FestivalService festivalService;

    @Operation(summary = "축제 생성")
    @PostMapping
    public FestivalResponse create(@RequestBody FestivalCreateRequest request) {
        return festivalService.createFestival(request);
    }

    @Operation(summary = "축제 수정")
    @PutMapping("/{id}")
    public FestivalResponse update(
            @PathVariable Long id,
            @RequestBody FestivalUpdateRequest request
    ) {
        return festivalService.updateFestival(id, request);
    }

    @Operation(summary = "축제 삭제")
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        festivalService.deleteFestival(id);
    }

    @Operation(summary = "축제 목록 조회 (관리자용)")
    @GetMapping
    public List<FestivalResponse> getAll() {
        return festivalService.getAllFestivalsForAdmin();
    }

    @Operation(summary = "축제 상세 조회 (관리자용)")
    @GetMapping("/{id}")
    public FestivalResponse get(@PathVariable Long id) {
        return festivalService.getFestival(id);
    }

    @Operation(summary = "축제 상태 토글 (ACTIVE <-> INACTIVE)")
    @PatchMapping("/{id}/toggle-status")
    public FestivalResponse toggleStatus(@PathVariable Long id) {
        return festivalService.toggleFestivalStatus(id);
    }

    @Operation(summary = "축제 패스권 할인 토글 (ON/OFF)")
    @PatchMapping("/{id}/toggle-discount")
    public FestivalResponse toggleDiscount(@PathVariable Long id) {
        return festivalService.toggleFestivalDiscount(id);
    }
}
