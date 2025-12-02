package com.turtletongtong.turtleconnect.route.service;

import com.turtletongtong.turtleconnect.global.error.ApiException;
import com.turtletongtong.turtleconnect.global.error.ErrorCode;
import com.turtletongtong.turtleconnect.location.entity.Location;
import com.turtletongtong.turtleconnect.location.repository.LocationRepository;
import com.turtletongtong.turtleconnect.route.dto.request.CreateRoutePlanRequest;
import com.turtletongtong.turtleconnect.route.dto.response.RoutePlanResponse;
import com.turtletongtong.turtleconnect.route.entity.BusRoute;
import com.turtletongtong.turtleconnect.route.entity.BusStop;
import com.turtletongtong.turtleconnect.route.entity.RouteMatch;
import com.turtletongtong.turtleconnect.route.repository.BusRouteRepository;
import com.turtletongtong.turtleconnect.route.repository.BusStopRepository;
import com.turtletongtong.turtleconnect.route.repository.RouteMatchRepository;
import com.turtletongtong.turtleconnect.route.service.RoutePlanService;
import com.turtletongtong.turtleconnect.tour.entity.TourRequest;
import com.turtletongtong.turtleconnect.tour.repository.TourRequestRepository;
import com.turtletongtong.turtleconnect.user.entity.Role;
import com.turtletongtong.turtleconnect.user.entity.User;
import com.turtletongtong.turtleconnect.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class RoutePlanServiceImpl implements RoutePlanService {

    private final TourRequestRepository tourRequestRepository;
    private final BusRouteRepository busRouteRepository;
    private final BusStopRepository busStopRepository;
    private final RouteMatchRepository routeMatchRepository;
    private final UserRepository userRepository;
    private final LocationRepository locationRepository;

    @Override
    public RoutePlanResponse createRoutePlan(Long agencyId, CreateRoutePlanRequest request) {

        // 1) 여행 요청 확인
        TourRequest tourRequest = tourRequestRepository.findById(request.tourRequestId())
                .orElseThrow(() -> new ApiException(ErrorCode.TOUR_REQUEST_NOT_FOUND));

        // 2) 여행사 계정 검증
        User agency = userRepository.findById(agencyId)
                .orElseThrow(() -> new ApiException(ErrorCode.USER_NOT_FOUND));

        if (agency.getRole() != Role.AGENCY) {
            throw new ApiException(ErrorCode.ACCESS_DENIED);
        }

        // 3) 인당 요금 계산
        int participantCount = tourRequest.getParticipantCount();
        int totalCost = request.totalCost();
        int pricePerPerson = totalCost / participantCount;

        // 4) BusRoute 생성
        BusRoute busRoute = BusRoute.builder()
                .agency(agency)
                .totalCost(totalCost)
                .pricePerPerson(pricePerPerson)
                .build();
        busRouteRepository.save(busRoute);

        // 5) 픽업 시간 정렬
        List<CreateRoutePlanRequest.StopRequest> sortedStops =
                request.stops().stream()
                        .sorted(Comparator.comparing(CreateRoutePlanRequest.StopRequest::pickupTime))
                        .toList();

        // 6) BusStop 저장
        int order = 1;
        LocalDate startDate = tourRequest.getStartDate();

        for (CreateRoutePlanRequest.StopRequest stopReq : sortedStops) {

            Location location = locationRepository.findById(stopReq.locationId())
                    .orElseThrow(() -> new ApiException(ErrorCode.LOCATION_NOT_FOUND));

            LocalTime pickupTime = LocalTime.parse(stopReq.pickupTime());
            LocalDateTime pickupDateTime = LocalDateTime.of(startDate, pickupTime);

            BusStop busStop = BusStop.builder()
                    .busRoute(busRoute)
                    .location(location)
                    .stopOrder(order++)
                    .pickupTime(pickupDateTime)
                    .build();

            busStopRepository.save(busStop);
        }

        // 7) RouteMatch 생성
        RouteMatch match = RouteMatch.builder()
                .tourRequest(tourRequest)
                .busRoute(busRoute)
                .build();
        routeMatchRepository.save(match);

        // 8) 여행 요청 상태 변경
        tourRequest.match();

        List<RoutePlanResponse.RoutePlanStop> responseStops =
                sortedStops.stream()
                        .map(stop -> {

                            Location loc = locationRepository.findById(stop.locationId())
                                    .orElseThrow(() -> new ApiException(ErrorCode.LOCATION_NOT_FOUND));

                            LocalTime pickupTime = LocalTime.parse(stop.pickupTime());
                            LocalDateTime pickupDateTime = LocalDateTime.of(startDate, pickupTime);

                            int orderIndex = sortedStops.indexOf(stop) + 1;

                            return new RoutePlanResponse.RoutePlanStop(
                                    loc.getId(),
                                    loc.getName(),
                                    orderIndex,
                                    pickupDateTime
                            );
                        })
                        .toList();

        // 9. 최종 return
        return new RoutePlanResponse(
                busRoute.getId(),
                startDate,
                participantCount,
                totalCost,
                pricePerPerson,
                responseStops
        );
    }
}
