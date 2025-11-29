package com.turtletongtong.turtleconnect.user.exception;

import com.turtletongtong.turtleconnect.global.error.ApiException;
import com.turtletongtong.turtleconnect.global.error.ErrorCode;

/**
 * User 도메인의 최상위 예외 클래스.
 */
public class UserException extends ApiException {

    public UserException(ErrorCode errorCode) {
        super(errorCode);
    }
}
