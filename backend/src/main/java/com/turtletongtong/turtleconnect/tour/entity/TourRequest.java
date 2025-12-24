package com.turtletongtong.turtleconnect.tour.entity;

import com.turtletongtong.turtleconnect.location.entity.Location;
import com.turtletongtong.turtleconnect.route.entity.RouteMatch;
import com.turtletongtong.turtleconnect.user.entity.User;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "tour_request")
@Getter
@NoArgsConstructor
public class TourRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "location_id", nullable = false)
    private Location location;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Column(name = "participant_count", nullable = false)
    private Integer participantCount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private TourRequestStatus status;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Builder
    private TourRequest(
            User user,
            Location location,
            LocalDate startDate,
            LocalDate endDate,
            Integer participantCount,
            TourRequestStatus status
    ) {
        this.user = user;
        this.location = location;
        this.startDate = startDate;
        this.endDate = endDate;
        this.participantCount = participantCount;
        this.status = status;
    }
    public void match() {
        // WAITING → MATCHED 변경
        if (this.status == TourRequestStatus.WAITING) {
            this.status = TourRequestStatus.MATCHED;
        }
    }

    public void confirm(RouteMatch match) {
        // MATCHED → CONFIRMED
        this.status = TourRequestStatus.CONFIRMED;
    }
    public void cancel() {
        this.status = TourRequestStatus.CANCELED;
    }
}
