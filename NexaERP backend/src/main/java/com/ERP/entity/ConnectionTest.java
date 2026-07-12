package com.ERP.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "connection_test")
public class ConnectionTest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "message")
    private String message;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    // Constructor default
    public ConnectionTest() {}

    public ConnectionTest(String message) {
        this.message = message;
        this.createdAt = LocalDateTime.now();
    }

    // Getters
    public Long getId() { return id; }
    public String getMessage() { return message; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    @Override
    public String toString() {
        return "ConnectionTest{id=" + id + ", message='" + message + "', createdAt=" + createdAt + "}";
    }
}