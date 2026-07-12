package com.ERP.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "asset_depreciation")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AssetDepreciation {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "asset_id", nullable = false)
    private Asset asset;

    @Column(name = "period_year", nullable = false)
    private Integer periodYear;

    @Column(name = "period_month", nullable = false)
    private Integer periodMonth;

    @Column(name = "opening_value", precision = 18, scale = 2)
    @Builder.Default
    private BigDecimal openingValue = BigDecimal.ZERO;

    @Column(precision = 18, scale = 2)
    @Builder.Default
    private BigDecimal depreciation = BigDecimal.ZERO;

    @Column(name = "closing_value", precision = 18, scale = 2)
    @Builder.Default
    private BigDecimal closingValue = BigDecimal.ZERO;

    @Column(length = 30)
    @Builder.Default
    private String method = "Straight-Line";

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}
