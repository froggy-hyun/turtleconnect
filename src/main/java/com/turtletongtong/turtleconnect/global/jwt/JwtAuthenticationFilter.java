package com.turtletongtong.turtleconnect.global.jwt;

import com.turtletongtong.turtleconnect.global.redis.TokenRedisRepository;
import com.turtletongtong.turtleconnect.user.entity.Role;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

/**
 * 요청마다 실행되어 AccessToken을 검증하는 JWT 인증 필터.
 * 유효한 토큰이면 SecurityContext에 Authentication 정보를 저장한다.
 */
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtProvider jwtProvider;
    private final TokenRedisRepository redisRepository;

    public JwtAuthenticationFilter(JwtProvider jwtProvider, TokenRedisRepository redisRepository) {
        this.jwtProvider = jwtProvider;
        this.redisRepository = redisRepository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String header = request.getHeader("Authorization");

        if (header != null) {
            String token;

            if (header.startsWith("Bearer ")) {
                token = header.substring(7);
            }
            else {
                token = header;
            }

            try {
                jwtProvider.validateToken(token);

                Long userId = jwtProvider.getUserId(token);
                Role role = jwtProvider.getRole(token);

                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                userId,
                                null,
                                List.of(new SimpleGrantedAuthority("ROLE_" + role.name()))
                        );

                SecurityContextHolder.getContext().setAuthentication(authentication);
                request.setAttribute("userId", userId);

            } catch (Exception ignored) {}
        }

        filterChain.doFilter(request, response);
    }
}
