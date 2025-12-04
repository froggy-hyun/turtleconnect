package com.turtletongtong.turtleconnect.user.service;

import com.turtletongtong.turtleconnect.user.dto.request.SelectQuoteRequest;
import com.turtletongtong.turtleconnect.user.dto.response.SelectQuoteResponse;
import com.turtletongtong.turtleconnect.user.dto.response.UserQuoteListResponse;

public interface UserQuoteService {

    UserQuoteListResponse getQuotesForRequest(Long userId, Long tourRequestId);

    SelectQuoteResponse selectQuote(Long userId, SelectQuoteRequest request);
}
