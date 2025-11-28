package com.turtletongtong.turtleconnect.festival.service;

import com.turtletongtong.turtleconnect.festival.dto.request.FestivalCreateRequest;
import com.turtletongtong.turtleconnect.festival.dto.request.FestivalUpdateRequest;
import com.turtletongtong.turtleconnect.festival.dto.response.FestivalResponse;
import com.turtletongtong.turtleconnect.festival.entity.Festival;
import com.turtletongtong.turtleconnect.festival.entity.FestivalStatus;
import com.turtletongtong.turtleconnect.festival.repository.FestivalRepository;
import com.turtletongtong.turtleconnect.global.error.ApiException;
import com.turtletongtong.turtleconnect.global.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class FestivalServiceImpl implements FestivalService {

    private final FestivalRepository festivalRepository;

    @Override
    public FestivalResponse createFestival(FestivalCreateRequest request) {
        Festival festival = Festival.create(
                request.name(),
                request.description(),
                request.location(),
                request.startDate(),
                request.endDate(),
                request.specialEvent(),
                request.mainPrograms(),
                request.imageUrl(),
                request.status(),
                request.hasDiscount(),
                request.discountDescription()
        );
        return FestivalResponse.from(festivalRepository.save(festival));
    }

    @Override
    public FestivalResponse updateFestival(Long id, FestivalUpdateRequest request) {
        Festival festival = getFestivalEntity(id);
        festival.update(
                request.name(),
                request.description(),
                request.location(),
                request.startDate(),
                request.endDate(),
                request.specialEvent(),
                request.mainPrograms(),
                request.imageUrl(),
                request.status(),
                request.hasDiscount(),
                request.discountDescription()
        );
        return FestivalResponse.from(festival);
    }

    @Override
    public void deleteFestival(Long id) {
        Festival festival = getFestivalEntity(id);
        festivalRepository.delete(festival);
    }

    @Override
    @Transactional(readOnly = true)
    public List<FestivalResponse> getAllFestivalsForAdmin() {
        return festivalRepository.findAll()
                .stream()
                .map(FestivalResponse::from)
                .toList();
    }

    @Override
    public FestivalResponse toggleFestivalStatus(Long id) {
        Festival festival = getFestivalEntity(id);
        festival.toggleStatus();
        return FestivalResponse.from(festival);
    }

    @Override
    public FestivalResponse toggleFestivalDiscount(Long id) {
        Festival festival = getFestivalEntity(id);
        festival.toggleDiscount();
        return FestivalResponse.from(festival);
    }

    @Override
    @Transactional(readOnly = true)
    public List<FestivalResponse> getActiveFestivals() {
        return festivalRepository.findByStatus(FestivalStatus.ACTIVE)
                .stream()
                .map(FestivalResponse::from)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public FestivalResponse getFestival(Long id) {
        return FestivalResponse.from(getFestivalEntity(id));
    }

    private Festival getFestivalEntity(Long id) {
        return festivalRepository.findById(id)
                .orElseThrow(() -> new ApiException(
                        ErrorCode.INTERNAL_SERVER_ERROR,
                        "축제를 찾을 수 없습니다."
                ));
    }
}
