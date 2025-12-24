package com.turtletongtong.turtleconnect.review.controller;

import com.turtletongtong.turtleconnect.global.security.SecurityUtil;
import com.turtletongtong.turtleconnect.review.dto.request.WriteReviewRequest;
import com.turtletongtong.turtleconnect.review.dto.response.ReviewResponse;
import com.turtletongtong.turtleconnect.review.entity.TargetType;
import com.turtletongtong.turtleconnect.review.service.ReviewService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @Operation(summary = "리뷰 작성", description = "축제 또는 관광지에 대한 리뷰를 작성.")
    @PostMapping
    public ReviewResponse write(@RequestBody WriteReviewRequest request) {
        Long userId = SecurityUtil.getCurrentUserId();
        return reviewService.writeReview(userId, request);
    }

    @Operation(summary = "리뷰 조회", description = "특정 대상(FESTIVAL,SPOT)의 모든 리뷰를 조회.")
    @GetMapping("/{targetType}/{targetId}")
    public List<ReviewResponse> getReviews(
            @Parameter(description = "리뷰 대상 타입", example = "FESTIVAL")
            @PathVariable TargetType targetType,

            @Parameter(description = "리뷰 대상 ID", example = "12")
            @PathVariable Long targetId
    ) {
        return reviewService.getReviews(targetType, targetId);
    }
}
