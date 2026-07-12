package com.ERP.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "opportunities")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Opportunity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id")
    private Customer customer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lead_id")
    private Lead lead;

    @Column(precision = 18, scale = 2)
    @Builder.Default
    private BigDecimal value = BigDecimal.ZERO;

    @Column(length = 10)
    @Builder.Default
    private String currency = "IDR";

    @Column(nullable = false, length = 50)
    @Builder.Default
    private String stage = "Prospecting";

    @Column
    @Builder.Default
    private Integer probability = 0;

    @Column(name = "expected_close")
    private LocalDate expectedClose;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id")
    private Employee owner;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();
}
