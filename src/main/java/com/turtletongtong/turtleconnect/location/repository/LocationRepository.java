package com.turtletongtong.turtleconnect.location.repository;

import com.turtletongtong.turtleconnect.location.entity.Location;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LocationRepository extends JpaRepository<Location, Long> {

    Optional<Location> findByIdAndIsActiveTrue(Long id);
}
