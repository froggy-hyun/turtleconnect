package com.turtletongtong.turtleconnect.route.service;

import com.turtletongtong.turtleconnect.global.error.ApiException;
import com.turtletongtong.turtleconnect.global.error.ErrorCode;
import com.turtletongtong.turtleconnect.location.entity.Location;
import com.turtletongtong.turtleconnect.location.repository.LocationRepository;
import com.turtletongtong.turtleconnect.route.dto.request.CreateRoutePlanRequest;
import com.turtletongtong.turtleconnect.route.dto.response.RoutePlanResponse;
import com.turtletongtong.turtleconnect.route.dto.response.RoutePlanSummaryResponse;
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
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class RoutePlanServiceImpl implements RoutePlanService
{
    private final TourRequestRepository tourRequestRepository;
    private final BusRouteRepository busRouteRepository;
    private final BusStopRepository busStopRepository;
    private final RouteMatchRepository routeMatchRepository;
    private final UserRepository userRepository;
    private final LocationRepository locationRepository;

    @Override
    public RoutePlanResponse createRoutePlan(Long agencyId, CreateRoutePlanRequest request)
    {
        User agency = userRepository.findById(agencyId)
                .orElseThrow(() -> new ApiException(ErrorCode.USER_NOT_FOUND));

        if (agency.getRole() != Role.AGENCY)
        {
            throw new ApiException(ErrorCode.ACCESS_DENIED);
        }

        LocalDate date = request.date();
        if (date == null)
        {
            throw new ApiException(ErrorCode.INVALID_INPUT_VALUE);
        }

        List<Long> locationIds = request.stops().stream()
                .map(CreateRoutePlanRequest.StopRequest::locationId)
                .distinct()
                .toList();

        if (locationIds.isEmpty())
        {
            throw new ApiException(ErrorCode.INVALID_INPUT_VALUE);
        }

        List<TourRequest> tourRequests = tourRequestRepository
                .findAllByDateAndStatusAndLocationIdIn(
                        date,
                        TourRequestStatus.WAITING,
                        locationIds
                );

        if (tourRequests.isEmpty())
        {
            throw new ApiException(ErrorCode.TOUR_REQUEST_NOT_FOUND);
        }

        int totalPassengerCount = tourRequests.stream()
                .mapToInt(TourRequest::getParticipantCount)
                .sum();

        int totalCost = request.totalCost();
        int pricePerPerson = totalPassengerCount > 0
                ? totalCost / totalPassengerCount
                : 0;

        BusRoute busRoute = BusRoute.builder()
                .agency(agency)
                .description(request.note())
                .capacity(totalPassengerCount)
                .pricePerPerson(pricePerPerson)
                .totalCost(totalCost)
                .build();

        busRouteRepository.save(busRoute);

        List<CreateRoutePlanRequest.StopRequest> sortedStops = request.stops().stream()
                .sorted(Comparator.comparing(CreateRoutePlanRequest.StopRequest::pickupTime))
                .toList();

        int order = 1;
        for (CreateRoutePlanRequest.StopRequest stopReq : sortedStops)
        {
            Location location = locationRepository.findById(stopReq.locationId())
                    .orElseThrow(() -> new ApiException(ErrorCode.LOCATION_NOT_FOUND));

            LocalTime time = LocalTime.parse(stopReq.pickupTime());
            LocalDateTime pickupDateTime = LocalDateTime.of(date, time);

            BusStop busStop = BusStop.builder()
                    .busRoute(busRoute)
                    .location(location)
                    .stopOrder(order++)
                    .pickupTime(pickupDateTime)
                    .build();

            busStopRepository.save(busStop);
        }

        for (TourRequest tr : tourRequests)
        {
            RouteMatch match = RouteMatch.builder()
                    .busRoute(busRoute)
                    .tourRequest(tr)
                    .totalCost(totalCost)
                    .pricePerPerson(pricePerPerson)
                    .build();

            routeMatchRepository.save(match);
        }

        for (TourRequest tr : tourRequests)
        {
            tr.match();
        }

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

        return new RoutePlanResponse(
                busRoute.getId(),
                date,
                totalPassengerCount,
                totalCost,
                pricePerPerson,
                responseStops
        );
    }

    @Override
    @Transactional(readOnly = true)
    public List<RoutePlanSummaryResponse> getRoutePlans(Long agencyId, LocalDate dateFilter)
    {
        User agency = userRepository.findById(agencyId)
                .orElseThrow(() -> new ApiException(ErrorCode.USER_NOT_FOUND));

        if (agency.getRole() != Role.AGENCY)
        {
            throw new ApiException(ErrorCode.ACCESS_DENIED);
        }

        List<BusRoute> routes = busRouteRepository.findAllByAgencyIdOrderByCreatedAtDesc(agencyId);
        if (routes.isEmpty())
        {
            return List.of();
        }

        List<Long> routeIds = routes.stream()
                .map(BusRoute::getId)
                .toList();

        List<BusStop> allStops = busStopRepository.findAllByRouteIdsOrderByRouteAndStop(routeIds);

        Map<Long, List<BusStop>> stopsByRouteId = allStops.stream()
                .collect(Collectors.groupingBy(
                        bs -> bs.getBusRoute().getId(),
                        LinkedHashMap::new,
                        Collectors.toList()
                ));

        return routes.stream()
                .map(route -> {
                    List<BusStop> stops = stopsByRouteId.getOrDefault(route.getId(), List.of());
                    if (stops.isEmpty())
                    {
                        return null;
                    }

                    LocalDate date = stops.get(0).getPickupTime().toLocalDate();
                    if (dateFilter != null && !dateFilter.equals(date))
                    {
                        return null;
                    }

                    return new RoutePlanSummaryResponse(
                            route.getId(),
                            date,
                            route.getDescription(),
                            route.getCapacity(),
                            route.getTotalCost(),
                            route.getPricePerPerson(),
                            stops.size(),
                            route.getCreatedAt()
                    );
                })
                .filter(Objects::nonNull)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public RoutePlanResponse getRoutePlan(Long agencyId, Long routeId)
    {
        User agency = userRepository.findById(agencyId)
                .orElseThrow(() -> new ApiException(ErrorCode.USER_NOT_FOUND));

        if (agency.getRole() != Role.AGENCY)
        {
            throw new ApiException(ErrorCode.ACCESS_DENIED);
        }

        BusRoute busRoute = busRouteRepository.findByIdAndAgencyId(routeId, agencyId)
                .orElseThrow(() -> new ApiException(ErrorCode.INVALID_INPUT_VALUE)); // 권장: BUS_ROUTE_NOT_FOUND로 분리

        List<BusStop> stops = busStopRepository.findAllByRouteIdWithLocation(routeId);
        if (stops.isEmpty())
        {
            throw new ApiException(ErrorCode.INVALID_INPUT_VALUE);
        }

        LocalDate date = stops.get(0).getPickupTime().toLocalDate();

        List<RoutePlanResponse.RoutePlanStop> responseStops = stops.stream()
                .map(bs -> new RoutePlanResponse.RoutePlanStop(
                        bs.getLocation().getId(),
                        bs.getLocation().getName(),
                        bs.getStopOrder(),
                        bs.getPickupTime()
                ))
                .toList();

        return new RoutePlanResponse(
                busRoute.getId(),
                date,
                busRoute.getCapacity(),
                busRoute.getTotalCost(),
                busRoute.getPricePerPerson(),
                responseStops
        );
    }
}