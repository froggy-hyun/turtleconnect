package com.turtletongtong.turtleconnect.route.repository;

import com.turtletongtong.turtleconnect.route.entity.BusRoute;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BusRouteRepository extends JpaRepository<BusRoute, Long> {
    List<BusRoute> findAllByAgencyIdOrderByCreatedAtDesc(Long agencyId);
    Optional<BusRoute> findByIdAndAgencyId(Long id, Long agencyId);
}
