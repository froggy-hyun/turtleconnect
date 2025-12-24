package com.turtletongtong.turtleconnect.spot.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "spot")
@Getter
@NoArgsConstructor
public class Spot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String name;

    @Column(name = "tag", length = 100)
    private String tag;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, length = 255)
    private String location;

    @Column(name = "image_url", nullable = false, length = 500)
    private String imageUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private SpotStatus status;

    @Column(name = "has_discount", nullable = false)
    private boolean hasDiscount;

    @Column(name = "discount_description", columnDefinition = "TEXT")
    private String discountDescription;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public static Spot create(
            String name,
            String tag,
            String description,
            String location,
            String imageUrl,
            SpotStatus status,
            boolean hasDiscount,
            String discountDescription
    ) {
        Spot s = new Spot();
        s.name = name;
        s.tag = tag;
        s.description = description;
        s.location = location;
        s.imageUrl = imageUrl;
        s.status = status;
        s.hasDiscount = hasDiscount;
        s.discountDescription = hasDiscount ? discountDescription : null;
        return s;
    }

    public void update(
            String name,
            String tag,
            String description,
            String location,
            String imageUrl,
            SpotStatus status,
            boolean hasDiscount,
            String discountDescription
    ) {
        this.name = name;
        this.tag = tag;
        this.description = description;
        this.location = location;
        this.imageUrl = imageUrl;
        this.status = status;
        this.hasDiscount = hasDiscount;
        this.discountDescription = hasDiscount ? discountDescription : null;
    }

    public void toggleStatus() {
        this.status = (this.status == SpotStatus.ACTIVE)
                ? SpotStatus.INACTIVE
                : SpotStatus.ACTIVE;
    }

    public void toggleDiscount() {
        this.hasDiscount = !this.hasDiscount;
        if (!this.hasDiscount) {
            this.discountDescription = null;
        }
    }
}
