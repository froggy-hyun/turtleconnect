package com.turtletongtong.turtleconnect.review.repository;

import com.turtletongtong.turtleconnect.review.entity.Review;
import com.turtletongtong.turtleconnect.review.entity.TargetType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findAllByTargetTypeAndTargetIdOrderByCreatedAtDesc(
            TargetType targetType, Long targetId
    );
}
