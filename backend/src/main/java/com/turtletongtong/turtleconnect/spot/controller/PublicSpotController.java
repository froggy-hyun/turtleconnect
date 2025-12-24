package com.turtletongtong.turtleconnect.spot.controller;

import com.turtletongtong.turtleconnect.spot.dto.response.SpotResponse;
import com.turtletongtong.turtleconnect.spot.service.SpotService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/public/spots")
@Tag(name = "Public - Spot", description = "사용자용 관광지 조회 API")
public class PublicSpotController {

    private final SpotService spotService;

    @Operation(summary = "활성화된 관광지 목록 조회")
    @GetMapping
    public List<SpotResponse> getActiveSpots() {
        return spotService.getActiveSpots();
    }

    @Operation(summary = "관광지 상세 조회")
    @GetMapping("/{id}")
    public SpotResponse getSpot(@PathVariable Long id) {
        return spotService.getSpot(id);
    }
}
