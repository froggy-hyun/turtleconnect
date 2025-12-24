package com.turtletongtong.turtleconnect.global.redis;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.concurrent.TimeUnit;

/**
 * RefreshToken 저장 및 조회 기능을 담당하는 Redis Repository.
 * 로그아웃 기능을 구현하기 전까지는 RefreshToken 저장 기능만 사용
 */
@Repository
public class TokenRedisRepository {

    private final RedisTemplate<String, String> redisTemplate;

    public TokenRedisRepository(RedisTemplate<String, String> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    private static final String RT_PREFIX = "RT:";

    public void saveRefreshToken(Long userId, String refreshToken) {
        redisTemplate.opsForValue().set(
                RT_PREFIX + userId,
                refreshToken,
                14, TimeUnit.DAYS
        );
    }

    public Optional<String> getRefreshToken(Long userId) {
        return Optional.ofNullable(
                redisTemplate.opsForValue().get(RT_PREFIX + userId)
        );
    }

    //로그 아웃을 위한것 Redis에서 RT:userId 삭제하면 끝
    public void deleteRefreshToken(Long userId) {
        redisTemplate.delete(RT_PREFIX + userId);
    }
}
