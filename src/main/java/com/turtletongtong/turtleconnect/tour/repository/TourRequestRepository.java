package com.turtletongtong.turtleconnect.tour.repository;

import com.turtletongtong.turtleconnect.tour.dto.response.TourRequestDateCountResponse;
import com.turtletongtong.turtleconnect.tour.dto.response.TourRequestLocationSummaryResponse;
import com.turtletongtong.turtleconnect.tour.dto.response.TourRequestSummaryResponse;
import com.turtletongtong.turtleconnect.tour.entity.TourRequest;
import com.turtletongtong.turtleconnect.tour.entity.TourRequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface TourRequestRepository extends JpaRepository<TourRequest, Long> {

    List<TourRequest> findByUserId(Long userId);

    /**
     * 월 단위 날짜별 요청 건수
     */
    @Query("""
        select new com.turtletongtong.turtleconnect.tour.dto.response.TourRequestDateCountResponse(
            tr.startDate,
            count(tr)
        )
        from TourRequest tr
        where tr.startDate >= :start
          and tr.startDate < :end
          and tr.status <> :canceled
        group by tr.startDate
        order by tr.startDate
        """)
    List<TourRequestDateCountResponse> findDateCountsBetween(
            @Param("start") LocalDate start,
            @Param("end") LocalDate end,
            @Param("canceled") TourRequestStatus canceled
    );

    /**
     * 특정 날짜 전체 수요 요약
     */
    @Query("""
        select new com.turtletongtong.turtleconnect.tour.dto.response.TourRequestSummaryResponse(
            count(tr),
            coalesce(sum(tr.participantCount), 0)
        )
        from TourRequest tr
        where tr.startDate = :date
          and tr.status <> :canceled
        """)
    TourRequestSummaryResponse findSummaryByDate(
            @Param("date") LocalDate date,
            @Param("canceled") TourRequestStatus canceled
    );

    /**
     * 특정 날짜 출발지별 수요 요약
     */
    @Query("""
        select new com.turtletongtong.turtleconnect.tour.dto.response.TourRequestLocationSummaryResponse(
            loc.id,
            loc.name,
            count(tr),
            coalesce(sum(tr.participantCount), 0)
        )
        from TourRequest tr
        join tr.location loc
        where tr.startDate = :date
          and tr.status <> :canceled
        group by loc.id, loc.name
        order by sum(tr.participantCount) desc
        """)
    List<TourRequestLocationSummaryResponse> findLocationSummaryByDate(
            @Param("date") LocalDate date,
            @Param("canceled") TourRequestStatus canceled
    );
}
