package com.turtletongtong.turtleconnect.route.entity;

import com.turtletongtong.turtleconnect.tour.entity.TourRequest;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "route_match")
@Getter
@NoArgsConstructor
public class RouteMatch {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 어떤 노선에
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bus_route_id", nullable = false)
    private BusRoute busRoute;

    // 어떤 예약이 매칭되었는지
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tour_request_id", nullable = false)
    private TourRequest tourRequest;
}
