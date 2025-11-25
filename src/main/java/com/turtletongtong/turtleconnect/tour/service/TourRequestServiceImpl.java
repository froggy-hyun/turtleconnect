package com.turtletongtong.turtleconnect.tour.service;

import com.turtletongtong.turtleconnect.global.error.ApiException;
import com.turtletongtong.turtleconnect.global.error.ErrorCode;
import com.turtletongtong.turtleconnect.location.entity.Location;
import com.turtletongtong.turtleconnect.location.repository.LocationRepository;
import com.turtletongtong.turtleconnect.route.entity.BusRoute;
import com.turtletongtong.turtleconnect.route.entity.BusStop;
import com.turtletongtong.turtleconnect.route.entity.RouteMatch;
import com.turtletongtong.turtleconnect.route.repository.BusStopRepository;
import com.turtletongtong.turtleconnect.route.repository.RouteMatchRepository;
import com.turtletongtong.turtleconnect.tour.dto.request.CreateTourRequest;
import com.turtletongtong.turtleconnect.tour.dto.response.MyTourRequestResponse;
import com.turtletongtong.turtleconnect.tour.dto.response.TourRequestResponse;
import com.turtletongtong.turtleconnect.tour.entity.TourRequest;
import com.turtletongtong.turtleconnect.tour.entity.TourRequestStatus;
import com.turtletongtong.turtleconnect.tour.repository.TourRequestRepository;
import com.turtletongtong.turtleconnect.user.entity.User;
import com.turtletongtong.turtleconnect.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class TourRequestServiceImpl implements TourRequestService {

    private final TourRequestRepository tourRequestRepository;
    private final UserRepository userRepository;
    private final LocationRepository locationRepository;
    private final RouteMatchRepository routeMatchRepository;
    private final BusStopRepository busStopRepository;

    @Override
    public TourRequestResponse create(Long userId, CreateTourRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ApiException(ErrorCode.USER_NOT_FOUND));

        Location location = locationRepository.findByIdAndIsActiveTrue(request.locationId())
                .orElseThrow(() -> new ApiException(ErrorCode.LOCATION_NOT_FOUND));

        if (request.startDate().isAfter(request.endDate())) {
            throw new ApiException(ErrorCode.INVALID_DATE_RANGE);
        }

        TourRequest tourRequest = TourRequest.builder()
                .user(user)
                .location(location)
                .startDate(request.startDate())
                .endDate(request.endDate())
                .participantCount(request.participantCount())
                .status(TourRequestStatus.WAITING)
                .build();

        TourRequest saved = tourRequestRepository.save(tourRequest);

        return new TourRequestResponse(
                saved.getId(),
                saved.getStatus(),
                saved.getLocation().getId(),
                saved.getLocation().getName(),
                saved.getStartDate(),
                saved.getEndDate(),
                saved.getParticipantCount(),
                saved.getCreatedAt()
        );
    }

    @Override
    public void cancel(Long userId, Long tourRequestId) {
        TourRequest tourRequest = tourRequestRepository.findById(tourRequestId)
                .orElseThrow(() -> new ApiException(ErrorCode.TOUR_REQUEST_NOT_FOUND));

        if (!tourRequest.getUser().getId().equals(userId)) {
            throw new ApiException(ErrorCode.ACCESS_DENIED);
        }

        tourRequest.cancel();
    }

    @Override
    @Transactional(readOnly = true)
    public List<MyTourRequestResponse> getMyTourRequests(Long userId) {
        List<TourRequest> tourRequests = tourRequestRepository.findByUserId(userId);

        return tourRequests.stream()
                .map(this::toMyResponse)
                .toList();
    }

    private MyTourRequestResponse toMyResponse(TourRequest tr) {
        // 기본값: WAITING 상태
        String locationName = tr.getLocation().getName();
        String routeName = null;
        Integer pricePerPerson = null;
        Integer totalPrice = null;
        java.time.LocalDateTime pickupTime = null;

        // route_match 있으면 MATCHED
        RouteMatch match = routeMatchRepository.findByTourRequestId(tr.getId()).orElse(null);
        if (match != null) {
            BusRoute busRoute = match.getBusRoute();
            routeName = busRoute.getRouteName();
            pricePerPerson = busRoute.getPricePerPerson();
            totalPrice = pricePerPerson * tr.getParticipantCount();

            BusStop busStop = busStopRepository
                    .findByBusRouteIdAndLocationId(busRoute.getId(), tr.getLocation().getId())
                    .orElse(null);

            if (busStop != null) {
                pickupTime = busStop.getPickupTime();
            }
        }

        return new MyTourRequestResponse(
                tr.getId(),
                locationName,
                routeName,
                tr.getStartDate(),
                tr.getEndDate(),
                pickupTime,
                tr.getParticipantCount(),
                pricePerPerson,
                totalPrice,
                tr.getStatus(),
                tr.getCreatedAt()
        );
    }
}
