package com.turtletongtong.turtleconnect.global.error;

import java.time.LocalDateTime;

/**
 * 클라이언트에 전달되는 에러 응답 형식.
 * Envelope 패턴에서 error 필드로 사용
 */
public record ErrorResponse(
        int status,
        String code,
        String message,
        LocalDateTime timestamp
) {
    public static ErrorResponse of(ErrorCode errorCode) {
        return new ErrorResponse(
                errorCode.getStatus().value(),
                errorCode.name(),
                errorCode.getMessage(),
                LocalDateTime.now()
        );
    }
}
