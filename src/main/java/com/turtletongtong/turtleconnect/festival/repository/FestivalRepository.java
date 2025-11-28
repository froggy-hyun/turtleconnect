package com.turtletongtong.turtleconnect.festival.repository;

import com.turtletongtong.turtleconnect.festival.entity.Festival;
import com.turtletongtong.turtleconnect.festival.entity.FestivalStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FestivalRepository extends JpaRepository<Festival, Long> {

    List<Festival> findByStatus(FestivalStatus status);
}
