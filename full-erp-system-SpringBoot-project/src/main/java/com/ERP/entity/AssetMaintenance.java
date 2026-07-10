package com.ERP.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "asset_maintenance")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AssetMaintenance {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "asset_id", nullable = false)
    private Asset asset;

    @Column(name = "maintenance_type", length = 50)
    private String maintenanceType;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "scheduled_date")
    private LocalDate scheduledDate;

    @Column(name = "completed_date")
    private LocalDate completedDate;

    @Column(precision = 18, scale = 2)
    @Builder.Default
    private BigDecimal cost = BigDecimal.ZERO;

    @Column(name = "performed_by", length = 150)
    private String performedBy;

    @Column(nullable = false, length = 20)
    @Builder.Default
    private String status = "Scheduled";

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}
