package com.turtletongtong.turtleconnect.route.repository;

import com.turtletongtong.turtleconnect.route.entity.BusStop;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface BusStopRepository extends JpaRepository<BusStop, Long> {

    Optional<BusStop> findByBusRouteIdAndLocationId(Long busRouteId, Long locationId);

    @Query("""
            select bs
            from BusStop bs
            where bs.busRoute.id in :routeIds
            order by bs.busRoute.id asc, bs.stopOrder asc
            """)
    List<BusStop> findAllByRouteIdsOrderByRouteAndStop(@Param("routeIds") List<Long> routeIds);

    @Query("""
            select bs
            from BusStop bs
            join fetch bs.location
            where bs.busRoute.id = :routeId
            order by bs.stopOrder asc
            """)
    List<BusStop> findAllByRouteIdWithLocation(@Param("routeId") Long routeId);
}
