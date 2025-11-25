package com.turtletongtong.turtleconnect.route.repository;

import com.turtletongtong.turtleconnect.route.entity.BusStop;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BusStopRepository extends JpaRepository<BusStop, Long> {

    Optional<BusStop> findByBusRouteIdAndLocationId(Long busRouteId, Long locationId);
}
