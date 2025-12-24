package com.turtletongtong.turtleconnect.spot.repository;

import com.turtletongtong.turtleconnect.spot.entity.Spot;
import com.turtletongtong.turtleconnect.spot.entity.SpotStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SpotRepository extends JpaRepository<Spot, Long> {
    List<Spot> findByStatus(SpotStatus status);
}
