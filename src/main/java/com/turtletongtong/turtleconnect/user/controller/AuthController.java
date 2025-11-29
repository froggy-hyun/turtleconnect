package com.turtletongtong.turtleconnect.user.controller;

import com.turtletongtong.turtleconnect.global.error.ApiException;
import com.turtletongtong.turtleconnect.global.error.ErrorCode;
import com.turtletongtong.turtleconnect.user.dto.request.UserLoginRequest;
import com.turtletongtong.turtleconnect.user.dto.request.UserSignUpRequest;
import com.turtletongtong.turtleconnect.user.dto.response.UserLoginResponse;
import com.turtletongtong.turtleconnect.user.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @Operation(summary = "회원가입")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "회원가입 성공"),
            @ApiResponse(responseCode = "409", description = "이미 존재하는 이메일")
    })
    @PostMapping("/signup")
    public String signUp(@RequestBody UserSignUpRequest request) {
        authService.signUp(request);
        return "회원가입 성공";
    }

    @Operation(summary = "로그인")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "로그인 성공"),
            @ApiResponse(responseCode = "404", description = "사용자 없음"),
            @ApiResponse(responseCode = "400", description = "비밀번호 불일치")
    })
    @PostMapping("/login")
    public UserLoginResponse login(@RequestBody UserLoginRequest request) {
        return authService.login(request);
    }

    @Operation(
            summary = "토큰 재발급",
            description = """
                이 API는 상단의 Authorize 버튼에 Refresh Token을 입력한 뒤 사용하세요.
                """
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "재발급 성공"),
            @ApiResponse(responseCode = "401", description = "Refresh Token 만료(EXPIRED_TOKEN)"),
            @ApiResponse(responseCode = "400", description = "유효하지 않은 Refresh Token"),
            @ApiResponse(responseCode = "404", description = "Redis에 Refresh Token 없음")
    })

    @PostMapping("/reissue")
    public UserLoginResponse reissue(HttpServletRequest request) {

        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || authHeader.isBlank()) {
            throw new ApiException(ErrorCode.INVALID_REFRESH_TOKEN);
        }

        String token = authHeader.replace("Bearer ", "").trim();

        return authService.reissue(token);
    }

}
