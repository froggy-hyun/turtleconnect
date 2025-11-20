package com.turtletongtong.turtleconnect.global.jwt;

import com.turtletongtong.turtleconnect.global.config.JwtProperties;
import com.turtletongtong.turtleconnect.user.entity.Role;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

/**
 * JWT 생성 및 검증을 담당하는 클래스.
 * AccessToken과 RefreshToken을 각각 생성한다.
 */
@Component
public class JwtProvider {

    private final JwtProperties properties;
    private final Key key;

    public JwtProvider(JwtProperties properties) {
        this.properties = properties;
        this.key = Keys.hmacShaKeyFor(properties.getSecret().getBytes());
    }

    public String createAccessToken(Long userId, Role role) {
        return createToken(userId, role, properties.getAccessTokenExpiration());
    }

    public String createRefreshToken(Long userId, Role role) {
        return createToken(userId, role, properties.getRefreshTokenExpiration());
    }

    private String createToken(Long userId, Role role, long expirationMs) {

        return Jwts.builder()
                .setSubject(userId.toString())
                .claim("role", role.name())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expirationMs))
                .signWith(key, SignatureAlgorithm.HS256
                )
                .compact();
    }

    public void validateToken(String token) {
        Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token);
    }

    public Long getUserId(String token) {
        return Long.parseLong(getClaims(token).getSubject());
    }

    public Role getRole(String token) {
        return Role.valueOf(getClaims(token).get("role", String.class));
    }

    public long getRemainingValidity(String token) {
        return getClaims(token).getExpiration().getTime() - System.currentTimeMillis();
    }

    private Claims getClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
