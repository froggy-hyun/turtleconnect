package com.turtletongtong.turtleconnect.review.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;

@Schema(description = "리뷰 응답 DTO")
public record ReviewResponse(

        @Schema(description = "리뷰 ID", example = "101")
        Long id,

        @Schema(description = "작성자 ID", example = "5")
        Long userId,

        @Schema(description = "작성자 이름", example = "홍길동")
        String userName,

        @Schema(description = "별점", example = "4")
        Integer rating,

        @Schema(description = "리뷰 내용", example = "정말 즐거웠어요!")
        String content,

        @Schema(description = "작성일", example = "2025-12-04T12:30:00")
        LocalDateTime createdAt
) {}