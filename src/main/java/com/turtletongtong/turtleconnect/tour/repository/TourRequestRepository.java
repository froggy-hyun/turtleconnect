package com.turtletongtong.turtleconnect.tour.repository;

import com.turtletongtong.turtleconnect.tour.entity.TourRequest;
import com.turtletongtong.turtleconnect.tour.entity.TourRequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TourRequestRepository extends JpaRepository<TourRequest, Long> {

    List<TourRequest> findByUserId(Long userId);

    List<TourRequest> findByUserIdAndStatus(Long userId, TourRequestStatus status);
}
