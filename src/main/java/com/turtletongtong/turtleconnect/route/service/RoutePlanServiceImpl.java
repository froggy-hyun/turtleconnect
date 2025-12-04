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
import com.turtletongtong.turtleconnect.tour.entity.TourRequest;
import com.turtletongtong.turtleconnect.tour.entity.TourRequestStatus;
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

        // 1. 여행사 계정 검증
        User agency = userRepository.findById(agencyId)
                .orElseThrow(() -> new ApiException(ErrorCode.USER_NOT_FOUND));

        if (agency.getRole() != Role.AGENCY) {
            throw new ApiException(ErrorCode.ACCESS_DENIED);
        }

        LocalDate date = request.date();
        if (date == null) {
            throw new ApiException(ErrorCode.INVALID_INPUT_VALUE);
        }

        // 2. 이 배차에 포함되는 location id 목록
        List<Long> locationIds = request.stops().stream()
                .map(CreateRoutePlanRequest.StopRequest::locationId)
                .distinct()
                .toList();

        if (locationIds.isEmpty()) {
            throw new ApiException(ErrorCode.INVALID_INPUT_VALUE);
        }

        // 3. 해당 날짜 + 위치 + WAITING 상태인 TourRequest 전체 조회
        List<TourRequest> tourRequests = tourRequestRepository
                .findAllByDateAndStatusAndLocationIdIn(
                        date,
                        TourRequestStatus.WAITING,
                        locationIds
                );

        if (tourRequests.isEmpty()) {
            throw new ApiException(ErrorCode.TOUR_REQUEST_NOT_FOUND);
        }

        // 4. 총 인원 계산 (백엔드에서 실제 수요 기준)
        int totalPassengerCount = tourRequests.stream()
                .mapToInt(TourRequest::getParticipantCount)
                .sum();

        int totalCost = request.totalCost();
        int pricePerPerson = totalPassengerCount > 0
                ? totalCost / totalPassengerCount
                : 0;

        // 5. BusRoute 생성
        BusRoute busRoute = BusRoute.builder()
                .agency(agency)
                .description(request.note())
                .capacity(totalPassengerCount)
                .pricePerPerson(pricePerPerson)
                .totalCost(totalCost)
                .build();

        busRouteRepository.save(busRoute);

        // 6. 정차역을 시간 순으로 정렬 + BusStop 생성
        List<CreateRoutePlanRequest.StopRequest> sortedStops = request.stops().stream()
                .sorted(Comparator.comparing(CreateRoutePlanRequest.StopRequest::pickupTime))
                .toList();

        int order = 1;
        for (CreateRoutePlanRequest.StopRequest stopReq : sortedStops) {

            Location location = locationRepository.findById(stopReq.locationId())
                    .orElseThrow(() -> new ApiException(ErrorCode.LOCATION_NOT_FOUND));

            LocalTime time = LocalTime.parse(stopReq.pickupTime()); // "HH:mm"
            LocalDateTime pickupDateTime = LocalDateTime.of(date, time);

            BusStop busStop = BusStop.builder()
                    .busRoute(busRoute)
                    .location(location)
                    .stopOrder(order++)
                    .pickupTime(pickupDateTime)
                    .build();

            busStopRepository.save(busStop);
        }

        // 7. RouteMatch 생성 – 이 BusRoute가 어떤 수요들(TourRequest)에 대한 견적인지
        for (TourRequest tr : tourRequests) {
            RouteMatch match = RouteMatch.builder()
                    .busRoute(busRoute)
                    .tourRequest(tr)
                    .totalCost(totalCost)
                    .pricePerPerson(pricePerPerson)
                    .build();

            routeMatchRepository.save(match);
        }

        for (TourRequest tr : tourRequests) {
            tr.match();
        }

        // 8. 응답용 RoutePlanStop 리스트 생성
        List<RoutePlanResponse.RoutePlanStop> responseStops =
                sortedStops.stream()
                        .map(stop -> {
                            Location loc = locationRepository.findById(stop.locationId())
                                    .orElseThrow(() -> new ApiException(ErrorCode.LOCATION_NOT_FOUND));

                            LocalTime time = LocalTime.parse(stop.pickupTime());
                            LocalDateTime pickupDateTime = LocalDateTime.of(date, time);

                            int orderIndex = sortedStops.indexOf(stop) + 1;

                            return new RoutePlanResponse.RoutePlanStop(
                                    loc.getId(),
                                    loc.getName(),
                                    orderIndex,
                                    pickupDateTime
                            );
                        })
                        .toList();

        // 9. 최종 응답
        return new RoutePlanResponse(
                busRoute.getId(),
                date,
                totalPassengerCount,
                totalCost,
                pricePerPerson,
                responseStops
        );
    }

}
