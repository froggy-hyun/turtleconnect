package com.turtletongtong.turtleconnect.user.controller;

import com.turtletongtong.turtleconnect.user.dto.request.SelectQuoteRequest;
import com.turtletongtong.turtleconnect.user.dto.response.SelectQuoteResponse;
import com.turtletongtong.turtleconnect.user.dto.response.UserQuoteListResponse;
import com.turtletongtong.turtleconnect.user.service.UserQuoteService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user/quotes")
@RequiredArgsConstructor
public class UserQuoteController {

    private final UserQuoteService userQuoteService;
    @Operation(
            summary = "견적 목록 조회",
            description = """
                    특정 TourRequest 에 대한 여행사가 제공한 견적 목록 조회
                """
    )
    @GetMapping("/{tourRequestId}")
    public UserQuoteListResponse getMyQuotes(
            @AuthenticationPrincipal Long userId,
            @PathVariable Long tourRequestId
    ) {
        return userQuoteService.getQuotesForRequest(userId, tourRequestId);
    }

    @Operation(
            summary = "견적서 확정",
            description = """
                받은 견적서중 최종 확정하기
                """
    )
    @PostMapping("/select")
    public SelectQuoteResponse selectQuote(
            @AuthenticationPrincipal Long userId,
            @RequestBody SelectQuoteRequest request
    ) {
        return userQuoteService.selectQuote(userId, request);
    }
}
