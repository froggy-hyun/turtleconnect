package com.turtletongtong.turtleconnect.festival.controller;

import com.turtletongtong.turtleconnect.festival.dto.response.FestivalResponse;
import com.turtletongtong.turtleconnect.festival.service.FestivalService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/public/festivals")
@Tag(name = "Public - Festival", description = "사용자용 축제 조회 API")
public class PublicFestivalController {

    private final FestivalService festivalService;

    @Operation(summary = "활성화된 축제 목록 조회")
    @GetMapping
    public List<FestivalResponse> getActiveFestivals() {
        return festivalService.getActiveFestivals();
    }

    @Operation(summary = "축제 상세 조회")
    @GetMapping("/{id}")
    public FestivalResponse getFestival(@PathVariable Long id) {
        return festivalService.getFestival(id);
    }
}
