package com.turtletongtong.turtleconnect.global.error;

/**
 * 모든 사용자 정의 예외의 상위 예외 클래스.
 * ErrorCode를 통해 상태 코드 및 메시지를 관리
 */
public class ApiException extends RuntimeException {

    private final ErrorCode errorCode;

    public ApiException(ErrorCode errorCode) {
        super(errorCode.getMessage());
        this.errorCode = errorCode;
    }

    public ApiException(ErrorCode errorCode, String message) {
        super(message);
        this.errorCode = errorCode;
    }

    public ErrorCode getErrorCode() {
        return errorCode;
    }
}
