package com.turtletongtong.turtleconnect.route.entity;

import com.turtletongtong.turtleconnect.user.entity.User;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "bus_route")
@Getter
@NoArgsConstructor
public class BusRoute {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "agency_id", nullable = false)
    private User agency;


    @Column(columnDefinition = "text")
    private String description;

    @Column(nullable = false)
    private Integer capacity;

    @Column(nullable = false)
    private Integer totalCost;

    @Column(name = "price_per_person", nullable = false)
    private Integer pricePerPerson;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    @Builder
    private BusRoute(User agency,
                     String description,
                     Integer capacity,
                     Integer totalCost,
                     Integer pricePerPerson) {
        this.agency = agency;
        this.description = description;
        this.capacity = capacity;
        this.totalCost = totalCost;
        this.pricePerPerson = pricePerPerson;
        this.createdAt = LocalDateTime.now();
    }
}
