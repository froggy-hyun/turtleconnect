package com.turtletongtong.turtleconnect.festival.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "festival")
@Getter
@NoArgsConstructor
public class Festival {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String name;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, length = 255)
    private String location;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Column(name = "special_event", columnDefinition = "TEXT")
    private String specialEvent;

    @Column(name = "main_programs", columnDefinition = "TEXT")
    private String mainPrograms;

    @Column(name = "image_url", nullable = false, length = 500)
    private String imageUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private FestivalStatus status;

    /** 패스권 할인 여부 */
    @Column(name = "has_discount", nullable = false)
    private boolean hasDiscount;

    /** "패스권 소지자 20% 할인" 같은 텍스트 그대로 */
    @Column(name = "discount_description", columnDefinition = "TEXT")
    private String discountDescription;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    // 생성 메서드
    public static Festival create(
            String name,
            String description,
            String location,
            LocalDate startDate,
            LocalDate endDate,
            String specialEvent,
            String mainPrograms,
            String imageUrl,
            FestivalStatus status,
            boolean hasDiscount,
            String discountDescription
    ) {
        Festival f = new Festival();
        f.name = name;
        f.description = description;
        f.location = location;
        f.startDate = startDate;
        f.endDate = endDate;
        f.specialEvent = specialEvent;
        f.mainPrograms = mainPrograms;
        f.imageUrl = imageUrl;
        f.status = status;
        f.hasDiscount = hasDiscount;
        f.discountDescription = hasDiscount ? discountDescription : null;
        return f;
    }

    // 전체 수정
    public void update(
            String name,
            String description,
            String location,
            LocalDate startDate,
            LocalDate endDate,
            String specialEvent,
            String mainPrograms,
            String imageUrl,
            FestivalStatus status,
            boolean hasDiscount,
            String discountDescription
    ) {
        this.name = name;
        this.description = description;
        this.location = location;
        this.startDate = startDate;
        this.endDate = endDate;
        this.specialEvent = specialEvent;
        this.mainPrograms = mainPrograms;
        this.imageUrl = imageUrl;
        this.status = status;
        this.hasDiscount = hasDiscount;
        this.discountDescription = hasDiscount ? discountDescription : null;
    }

    // 상태 토글
    public void toggleStatus() {
        this.status = (this.status == FestivalStatus.ACTIVE)
                ? FestivalStatus.INACTIVE
                : FestivalStatus.ACTIVE;
    }

    // 할인 토글 (OFF로 바꾸면 설명 비움)
    public void toggleDiscount() {
        this.hasDiscount = !this.hasDiscount;
        if (!this.hasDiscount) {
            this.discountDescription = null;
        }
    }

    // 할인 설명만 변경
    public void changeDiscountDescription(String description) {
        this.discountDescription = description;
    }
}
