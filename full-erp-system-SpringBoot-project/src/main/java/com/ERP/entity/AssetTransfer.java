package com.ERP.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "asset_transfers")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AssetTransfer {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "asset_id", nullable = false)
    private Asset asset;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "from_employee")
    private Employee fromEmployee;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "to_employee")
    private Employee toEmployee;

    @Column(name = "from_location", length = 150)
    private String fromLocation;

    @Column(name = "to_location", length = 150)
    private String toLocation;

    @Column(name = "transfer_date", nullable = false)
    private LocalDate transferDate;

    @Column(columnDefinition = "TEXT")
    private String reason;

    @Column(nullable = false, length = 20)
    @Builder.Default
    private String status = "Pending";

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "requested_by")
    private Employee requestedBy;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}
