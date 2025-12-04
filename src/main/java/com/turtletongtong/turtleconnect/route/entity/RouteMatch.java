package com.turtletongtong.turtleconnect.route.entity;

import com.turtletongtong.turtleconnect.route.entity.BusRoute;
import com.turtletongtong.turtleconnect.tour.entity.TourRequest;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "route_match")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RouteMatch {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bus_route_id", nullable = false)
    private BusRoute busRoute;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tour_request_id", nullable = false)
    private TourRequest tourRequest;

    @Column(nullable = false)
    private Integer totalCost; // 여행사의 총 비용

    @Column(nullable = false)
    private Integer pricePerPerson; // 인당 비용
    @Builder
    public RouteMatch(TourRequest tourRequest, BusRoute busRoute,
                      Integer pricePerPerson, Integer totalCost) {
        this.tourRequest = tourRequest;
        this.busRoute = busRoute;
        this.pricePerPerson = pricePerPerson;
        this.totalCost = totalCost;
    }
}
