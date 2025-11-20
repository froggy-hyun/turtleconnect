package com.turtletongtong.turtleconnect.user.service;

import com.turtletongtong.turtleconnect.user.dto.request.UserLoginRequest;
import com.turtletongtong.turtleconnect.user.dto.request.UserSignUpRequest;
import com.turtletongtong.turtleconnect.user.dto.response.UserLoginResponse;

/**
 * 회원가입, 로그인, 토큰 재발급 기능을 제공하는 서비스 인터페이스.
 */
public interface AuthService {

    void signUp(UserSignUpRequest request);

    UserLoginResponse login(UserLoginRequest request);

    UserLoginResponse reissue(String refreshToken);
}
