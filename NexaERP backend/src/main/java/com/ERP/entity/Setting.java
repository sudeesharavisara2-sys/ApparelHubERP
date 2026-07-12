package com.ERP.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "settings")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Setting {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String key;

    @Column(columnDefinition = "TEXT")
    private String value;

    @Column(length = 255)
    private String description;

    @Column(length = 50)
    @Builder.Default
    private String type = "string";

    @Column(name = "updated_by")
    private Long updatedBy;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();
}
