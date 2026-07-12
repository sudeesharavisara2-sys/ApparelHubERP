package com.ERP.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "time_entries")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class TimeEntry {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "task_id")
    private Task task;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id")
    private Project project;

    @Column(nullable = false)
    private LocalDate date;

    @Column(precision = 6, scale = 2, nullable = false)
    @Builder.Default
    private BigDecimal hours = BigDecimal.ZERO;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "is_billable")
    @Builder.Default
    private Boolean isBillable = true;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}
