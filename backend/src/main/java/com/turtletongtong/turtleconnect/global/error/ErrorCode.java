package com.turtletongtong.turtleconnect.global.error;

import org.springframework.http.HttpStatus;

/**
 * 공통 예외 코드 Enum.
 * 모든 도메인의 예외는 이 ErrorCode를 사용.
 */
public enum ErrorCode {
    INVALID_INPUT_VALUE(HttpStatus.BAD_REQUEST, "잘못된 입력입니다."),
    INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "서버 내부 오류가 발생했습니다."),
    ACCESS_DENIED(HttpStatus.FORBIDDEN, "접근 권한이 없습니다."),
    INVALID_PASSWORD(HttpStatus.BAD_REQUEST, "비밀번호가 일치하지 않습니다."),
    INVALID_REFRESH_TOKEN(HttpStatus.BAD_REQUEST, "유효하지 않은 리프레시 토큰입니다."),
    INVALID_TOKEN(HttpStatus.UNAUTHORIZED, "유효하지 않은 토큰입니다."),
    EXPIRED_TOKEN(HttpStatus.UNAUTHORIZED, "토큰이 만료되었습니다."),
    REFRESH_TOKEN_NOT_FOUND(HttpStatus.NOT_FOUND, "리프레시 토큰이 존재하지 않습니다."),

    USER_NOT_FOUND(HttpStatus.NOT_FOUND, "사용자를 찾을 수 없습니다."),
    USER_ALREADY_EXISTS(HttpStatus.CONFLICT, "이미 존재하는 이메일입니다."),
    LOCATION_NOT_FOUND(HttpStatus.NOT_FOUND, "위치를 찾을 수 없습니다."),

    TOUR_REQUEST_NOT_FOUND(HttpStatus.NOT_FOUND, "투어 예약 정보를 찾을 수 없습니다."),
    INVALID_DATE_RANGE(HttpStatus.BAD_REQUEST, "시작일은 종료일보다 이후일 수 없습니다."),
    TOUR_REQUEST_ALREADY_MATCHED(HttpStatus.BAD_REQUEST, "이미 배차가 완료된 투어 요청입니다."),

    BUS_ROUTE_NOT_FOUND(HttpStatus.NOT_FOUND, "버스 노선 정보를 찾을 수 없습니다."),
    BUS_STOP_NOT_FOUND(HttpStatus.NOT_FOUND, "버스 정차 정보를 찾을 수 없습니다."),
    ROUTE_MATCH_NOT_FOUND(HttpStatus.NOT_FOUND, "매칭된 배차 정보를 찾을 수 없습니다."),
    ALREADY_MATCHED(HttpStatus.NOT_FOUND, "여행객 상태가 Waitting가 아닙니다"),
    MATCH_NOT_FOUND(HttpStatus.NOT_FOUND, "견적을 찾을 수 없습니다."),
    ALREADY_CONFIRMED(HttpStatus.BAD_REQUEST, "이미 견적이 확정되었습니다.");

    private final HttpStatus status;
    private final String message;

    ErrorCode(HttpStatus status, String message) {
        this.status = status;
        this.message = message;
    }

    public HttpStatus getStatus() { return status; }
    public String getMessage() { return message; }
}
