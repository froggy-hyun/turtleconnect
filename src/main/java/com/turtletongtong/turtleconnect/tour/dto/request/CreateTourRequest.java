package com.turtletongtong.turtleconnect.tour.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

@Schema(description = "투어 예약 생성 요청 DTO")
public record CreateTourRequest(

        @Schema(description = "출발지 Location ID", example = "1")
        @NotNull
        Long locationId,

        @Schema(description = "여행 시작 날짜", example = "2025-07-01")
        @NotNull
        LocalDate startDate,

        @Schema(description = "여행 종료 날짜", example = "2025-07-03")
        @NotNull
        LocalDate endDate,

        @Schema(description = "참여 인원 수", example = "3")
        @NotNull @Min(1)
        Integer participantCount

) {}
