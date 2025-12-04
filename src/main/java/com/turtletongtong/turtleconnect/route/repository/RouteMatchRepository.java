package com.turtletongtong.turtleconnect.route.repository;

import com.turtletongtong.turtleconnect.route.entity.RouteMatch;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RouteMatchRepository extends JpaRepository<RouteMatch, Long> {

    List<RouteMatch> findAllByTourRequestId(Long tourRequestId);

    Optional<RouteMatch> findByTourRequestId(Long tourRequestId);
}
