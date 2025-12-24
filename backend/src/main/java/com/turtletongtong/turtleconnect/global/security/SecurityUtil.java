package com.turtletongtong.turtleconnect.global.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
// JwtAuthenticationFilter 에서 principal에 userId를 저장해두었기 때문에 여기서 그대로 꺼네 쓰세요~
public class SecurityUtil {

    public static Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || authentication.getPrincipal() == null) {
            return null;
        }

        return (Long) authentication.getPrincipal();
    }
}
