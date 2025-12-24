package com.turtletongtong.turtleconnect.user.service;

import com.turtletongtong.turtleconnect.global.error.ErrorCode;
import com.turtletongtong.turtleconnect.global.jwt.JwtProvider;
import com.turtletongtong.turtleconnect.global.redis.TokenRedisRepository;
import com.turtletongtong.turtleconnect.user.dto.request.UserLoginRequest;
import com.turtletongtong.turtleconnect.user.dto.request.UserSignUpRequest;
import com.turtletongtong.turtleconnect.user.dto.response.UserLoginResponse;
import com.turtletongtong.turtleconnect.user.entity.User;
import com.turtletongtong.turtleconnect.user.exception.UserException;
import com.turtletongtong.turtleconnect.user.mapper.UserMapper;
import com.turtletongtong.turtleconnect.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 인증 서비스 구현체.
 * 회원가입, 로그인, 토큰 재발급을 처리한다.
 */
@Service
@RequiredArgsConstructor
@Transactional
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;
    private final TokenRedisRepository redisRepository;

    @Override
    public void signUp(UserSignUpRequest request) {

        if (userRepository.existsByEmail(request.email())) {
            throw new UserException(ErrorCode.USER_ALREADY_EXISTS);
        }

        String encodedPassword = passwordEncoder.encode(request.password());
        User user = userMapper.toEntity(request, encodedPassword);

        userRepository.save(user);
    }

    @Override
    public UserLoginResponse login(UserLoginRequest request) {

        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new UserException(ErrorCode.USER_NOT_FOUND));

        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new UserException(ErrorCode.INVALID_PASSWORD);
        }

        String accessToken = jwtProvider.createAccessToken(user.getId(), user.getRole());
        String refreshToken = jwtProvider.createRefreshToken(user.getId(), user.getRole());

        redisRepository.saveRefreshToken(user.getId(), refreshToken);

        return new UserLoginResponse(
                accessToken,
                refreshToken,
                user.getId(),
                user.getRole().name()
        );
    }

    @Override
    public UserLoginResponse reissue(String refreshToken) {

        jwtProvider.validateToken(refreshToken);

        Long userId = jwtProvider.getUserId(refreshToken);

        String storedRefreshToken = redisRepository.getRefreshToken(userId)
                .orElseThrow(() -> new UserException(ErrorCode.REFRESH_TOKEN_NOT_FOUND));

        if (!storedRefreshToken.equals(refreshToken)) {
            throw new UserException(ErrorCode.INVALID_REFRESH_TOKEN);
        }

        String newAccess = jwtProvider.createAccessToken(userId, jwtProvider.getRole(refreshToken));
        String newRefresh = jwtProvider.createRefreshToken(userId, jwtProvider.getRole(refreshToken));

        String role = jwtProvider.getRole(refreshToken).name();

        return new UserLoginResponse(
                newAccess,
                newRefresh,
                userId,
                role
        );
    }
}
