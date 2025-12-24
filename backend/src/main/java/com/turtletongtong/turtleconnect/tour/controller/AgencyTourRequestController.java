package com.turtletongtong.turtleconnect.tour.controller;

import com.turtletongtong.turtleconnect.tour.dto.response.*;
import com.turtletongtong.turtleconnect.tour.service.TourRequestService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/agency/requests")
@RequiredArgsConstructor
@Tag(name = "Agency - Tour Requests", description = "여행사 견적/수요 조회 API")
@PreAuthorize("hasRole('AGENCY')")
public class AgencyTourRequestController {

    private final TourRequestService tourRequestService;

    @Operation(
            summary = "월 단위 날짜별 요청 건수 조회",
            description = "특정 연도/월에 대해, 요청이 존재하는 날짜와 해당 날짜의 요청 건수를 반환. " +
                    "프론트에서 날짜 탭(11월 20일 (29))을 구성할 때 사용."
    )
    @GetMapping("/dates")
    public List<TourRequestDateCountResponse> getDateCounts(
            @RequestParam int year,
            @RequestParam int month
    ) {
        return tourRequestService.getDateCounts(year, month);
    }

    @Operation(
            summary = "특정 날짜 전체 수요 요약 조회",
            description = "선택된 날짜에 대한 전체 인원 수와 전체 요청 건수를 반환. " +
                    "화면 하단의 '전체 배차 계획 - 전체 인원 / 전체 요청' 영역에서 사용."+
                    "요청은 0000-00-00 형식으로 요청"
    )
    @GetMapping("/summary")
    public TourRequestSummaryResponse getSummary(
            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate date
    ) {
        return tourRequestService.getSummary(date);
    }

    @Operation(
            summary = "특정 날짜 출발지별 수요 요약 조회",
            description = "선택된 날짜에 대해 출발지(location)별 요청 건수와 총 인원을 반환. " +
                    "하단 카드 리스트 (강남역 13명 / 4건 등)에 사용."+
                    "요청은 0000-00-00 형식으로 요청"
    )
    @GetMapping("/by-location")
    public List<TourRequestLocationSummaryResponse> getLocationSummary(
            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate date
    ) {
        return tourRequestService.getLocationSummary(date);
    }
}
