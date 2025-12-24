package com.turtletongtong.turtleconnect.route.entity;

import com.turtletongtong.turtleconnect.location.entity.Location;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "bus_stop")
@Getter
@NoArgsConstructor
public class BusStop {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bus_route_id", nullable = false)
    private BusRoute busRoute;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "location_id", nullable = false)
    private Location location;

    @Column(name = "stop_order", nullable = false)
    private Integer stopOrder;

    // ERD 타입이 timestamp라 LocalDateTime 으로 매핑
    @Column(name = "pickup_time", nullable = false)
    private LocalDateTime pickupTime;
    @Builder
    private BusStop(BusRoute busRoute,
                    Location location,
                    Integer stopOrder,
                    LocalDateTime pickupTime) {
        this.busRoute = busRoute;
        this.location = location;
        this.stopOrder = stopOrder;
        this.pickupTime = pickupTime;
    }
}
