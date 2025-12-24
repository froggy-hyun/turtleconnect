package com.turtletongtong.turtleconnect.user.mapper;

import com.turtletongtong.turtleconnect.user.dto.request.UserSignUpRequest;
import com.turtletongtong.turtleconnect.user.entity.User;
import org.springframework.stereotype.Component;

/**
 * UserSignUpRequest DTO를 User 엔티티로 변환하는 Mapper.
 */
@Component
public class UserMapper {

    public User toEntity(UserSignUpRequest request, String encodedPassword) {

        User user = new User();
        user.setEmail(request.email());
        user.setPassword(encodedPassword);
        user.setName(request.name());
        user.setPhone(request.phone());
        user.setGender(request.gender());
        user.setBirthDate(request.birthDate());
        user.setRole(request.role());

        return user;
    }
}
