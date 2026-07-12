package com.ERP.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "stock_levels")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class StockLevel {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "warehouse_id", nullable = false)
    private Warehouse warehouse;

    @Column(precision = 18, scale = 3)
    @Builder.Default
    private BigDecimal quantity = BigDecimal.ZERO;

    @Column(name = "reserved_qty", precision = 18, scale = 3)
    @Builder.Default
    private BigDecimal reservedQty = BigDecimal.ZERO;

    @Column(name = "last_updated")
    private LocalDateTime lastUpdated = LocalDateTime.now();
}
