package com.turtletongtong.turtleconnect.review.dto.request;

import com.turtletongtong.turtleconnect.review.entity.TargetType;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

@Schema(description = "리뷰 작성 요청 DTO")
public record WriteReviewRequest(

        @Schema(description = "리뷰 대상 타입 (FESTIVAL, TOUR_SPOT)", example = "FESTIVAL")
        @NotNull
        TargetType targetType,

        @Schema(description = "리뷰 대상의 고유 ID", example = "12")
        @NotNull
        Long targetId,

        @Schema(description = "별점 (1~5)", example = "5")
        @NotNull @Min(1) @Max(5)
        Integer rating,

        @Schema(description = "리뷰 내용", example = "너무 좋았어요! 다음에 또 가고 싶어요.")
        @NotNull
        String content
) {}