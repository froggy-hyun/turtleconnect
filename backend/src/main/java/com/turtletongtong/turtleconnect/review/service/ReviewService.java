package com.turtletongtong.turtleconnect.review.service;

import com.turtletongtong.turtleconnect.global.error.ApiException;
import com.turtletongtong.turtleconnect.global.error.ErrorCode;
import com.turtletongtong.turtleconnect.review.dto.request.WriteReviewRequest;
import com.turtletongtong.turtleconnect.review.dto.response.ReviewResponse;
import com.turtletongtong.turtleconnect.review.entity.Review;
import com.turtletongtong.turtleconnect.review.entity.TargetType;
import com.turtletongtong.turtleconnect.review.repository.ReviewRepository;
import com.turtletongtong.turtleconnect.user.entity.User;
import com.turtletongtong.turtleconnect.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;

    @Transactional
    public ReviewResponse writeReview(Long userId, WriteReviewRequest request) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ApiException(ErrorCode.USER_NOT_FOUND));

        Review review = Review.builder()
                .user(user)
                .targetType(request.targetType())
                .targetId(request.targetId())
                .rating(request.rating())
                .content(request.content())
                .build();

        Review saved = reviewRepository.save(review);

        return new ReviewResponse(
                saved.getId(),
                user.getId(),
                user.getName(),
                saved.getRating(),
                saved.getContent(),
                saved.getCreatedAt()
        );
    }

    @Transactional(readOnly = true)
    public List<ReviewResponse> getReviews(TargetType type, Long targetId) {

        return reviewRepository
                .findAllByTargetTypeAndTargetIdOrderByCreatedAtDesc(type, targetId)
                .stream()
                .map(r -> new ReviewResponse(
                        r.getId(),
                        r.getUser().getId(),
                        r.getUser().getName(),
                        r.getRating(),
                        r.getContent(),
                        r.getCreatedAt()
                ))
                .toList();
    }
}
