package com.turtletongtong.turtleconnect.spot.service;

import com.turtletongtong.turtleconnect.global.error.ApiException;
import com.turtletongtong.turtleconnect.global.error.ErrorCode;
import com.turtletongtong.turtleconnect.spot.dto.request.SpotCreateRequest;
import com.turtletongtong.turtleconnect.spot.dto.request.SpotUpdateRequest;
import com.turtletongtong.turtleconnect.spot.dto.response.SpotResponse;
import com.turtletongtong.turtleconnect.spot.entity.Spot;
import com.turtletongtong.turtleconnect.spot.entity.SpotStatus;
import com.turtletongtong.turtleconnect.spot.repository.SpotRepository;
import com.turtletongtong.turtleconnect.spot.service.SpotService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class SpotServiceImpl implements SpotService {

    private final SpotRepository spotRepository;

    @Override
    public SpotResponse createSpot(SpotCreateRequest request) {
        Spot spot = Spot.create(
                request.name(),
                request.tag(),
                request.description(),
                request.location(),
                request.imageUrl(),
                request.status(),
                request.hasDiscount(),
                request.discountDescription()
        );
        return SpotResponse.from(spotRepository.save(spot));
    }

    @Override
    public SpotResponse updateSpot(Long id, SpotUpdateRequest request) {
        Spot spot = getSpotEntity(id);
        spot.update(
                request.name(),
                request.tag(),
                request.description(),
                request.location(),
                request.imageUrl(),
                request.status(),
                request.hasDiscount(),
                request.discountDescription()
        );
        return SpotResponse.from(spot);
    }

    @Override
    public void deleteSpot(Long id) {
        Spot spot = getSpotEntity(id);
        spotRepository.delete(spot);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SpotResponse> getAllSpotsForAdmin() {
        return spotRepository.findAll()
                .stream()
                .map(SpotResponse::from)
                .toList();
    }

    @Override
    public SpotResponse toggleSpotStatus(Long id) {
        Spot spot = getSpotEntity(id);
        spot.toggleStatus();
        return SpotResponse.from(spot);
    }

    @Override
    public SpotResponse toggleSpotDiscount(Long id) {
        Spot spot = getSpotEntity(id);
        spot.toggleDiscount();
        return SpotResponse.from(spot);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SpotResponse> getActiveSpots() {
        return spotRepository.findByStatus(SpotStatus.ACTIVE)
                .stream()
                .map(SpotResponse::from)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public SpotResponse getSpot(Long id) {
        return SpotResponse.from(getSpotEntity(id));
    }

    private Spot getSpotEntity(Long id) {
        return spotRepository.findById(id)
                .orElseThrow(() -> new ApiException(
                        ErrorCode.INTERNAL_SERVER_ERROR,
                        "관광지를 찾을 수 없습니다."
                ));
    }
}
