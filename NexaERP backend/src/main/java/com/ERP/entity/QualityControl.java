package com.ERP.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "quality_control")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class QualityControl {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "production_order_id")
    private ProductionOrder productionOrder;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;

    @Column(name = "inspection_date", nullable = false)
    private LocalDate inspectionDate;

    @Column(name = "batch_number", length = 50)
    private String batchNumber;

    @Column(name = "total_inspected", precision = 18, scale = 3)
    @Builder.Default
    private BigDecimal totalInspected = BigDecimal.ZERO;

    @Column(precision = 18, scale = 3)
    @Builder.Default
    private BigDecimal passed = BigDecimal.ZERO;

    @Column(precision = 18, scale = 3)
    @Builder.Default
    private BigDecimal failed = BigDecimal.ZERO;

    @Column(nullable = false, length = 20)
    @Builder.Default
    private String result = "Pending";

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "inspector_id")
    private Employee inspector;

    @Column(columnDefinition = "TEXT")
    private String remarks;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}
