package com.turtletongtong.turtleconnect.user.service;

import com.turtletongtong.turtleconnect.global.error.ApiException;
import com.turtletongtong.turtleconnect.global.error.ErrorCode;
import com.turtletongtong.turtleconnect.route.entity.BusRoute;
import com.turtletongtong.turtleconnect.route.entity.BusStop;
import com.turtletongtong.turtleconnect.route.entity.RouteMatch;
import com.turtletongtong.turtleconnect.route.repository.BusStopRepository;
import com.turtletongtong.turtleconnect.route.repository.RouteMatchRepository;
import com.turtletongtong.turtleconnect.tour.entity.TourRequest;
import com.turtletongtong.turtleconnect.tour.entity.TourRequestStatus;
import com.turtletongtong.turtleconnect.tour.repository.TourRequestRepository;
import com.turtletongtong.turtleconnect.user.dto.request.SelectQuoteRequest;
import com.turtletongtong.turtleconnect.user.dto.response.SelectQuoteResponse;
import com.turtletongtong.turtleconnect.user.dto.response.UserQuoteItemResponse;
import com.turtletongtong.turtleconnect.user.dto.response.UserQuoteListResponse;
import com.turtletongtong.turtleconnect.user.service.UserQuoteService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class UserQuoteServiceImpl implements UserQuoteService {

    private final TourRequestRepository tourRequestRepository;
    private final RouteMatchRepository routeMatchRepository;
    private final BusStopRepository busStopRepository;

    @Override
    @Transactional(readOnly = true)
    public UserQuoteListResponse getQuotesForRequest(Long userId, Long tourRequestId) {

        TourRequest tr = tourRequestRepository.findById(tourRequestId)
                .orElseThrow(() -> new ApiException(ErrorCode.TOUR_REQUEST_NOT_FOUND));

        if (!tr.getUser().getId().equals(userId)) {
            throw new ApiException(ErrorCode.ACCESS_DENIED);
        }

        // 해당 요청에 연결된 견적 전체
        List<RouteMatch> matches = routeMatchRepository.findAllByTourRequestId(tr.getId());

        List<UserQuoteItemResponse> items = matches.stream()
                .map(match -> {

                    BusRoute route = match.getBusRoute();

                    BusStop stop = busStopRepository
                            .findByBusRouteIdAndLocationId(route.getId(), tr.getLocation().getId())
                            .orElse(null);

                    return new UserQuoteItemResponse(
                            match.getId(),
                            route.getAgency().getName(),
                            match.getTotalCost(),
                            match.getPricePerPerson(),
                            stop != null ? stop.getPickupTime() : null,
                            route.getDescription() // 🔥 NOTE: 여행사 메모
                    );
                })
                .toList();

        return new UserQuoteListResponse(
                tr.getId(),
                tr.getStartDate(),
                tr.getEndDate(),
                tr.getLocation().getName(),
                tr.getParticipantCount(),
                tr.getStatus(),
                items
        );
    }

    @Override
    public SelectQuoteResponse selectQuote(Long userId, SelectQuoteRequest request) {

        RouteMatch match = routeMatchRepository.findById(request.routeMatchId())
                .orElseThrow(() -> new ApiException(ErrorCode.ROUTE_MATCH_NOT_FOUND));

        TourRequest tr = match.getTourRequest();

        if (!tr.getUser().getId().equals(userId)) {
            throw new ApiException(ErrorCode.ACCESS_DENIED);
        }

        if (tr.getStatus() == TourRequestStatus.CONFIRMED) {
            throw new ApiException(ErrorCode.ALREADY_CONFIRMED);
        }

        tr.confirm(match);

        return new SelectQuoteResponse(
                tr.getId(),
                match.getId(),
                tr.getStatus(),
                match.getBusRoute().getAgency().getName(),
                match.getPricePerPerson(),
                match.getTotalCost()
        );
    }
}
