package com.phong.taskmanagement.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "activity_logs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ActivityLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "NVARCHAR(100)")
    private String action;

    @Column(columnDefinition = "NVARCHAR(MAX)")
    private String description;

    @Column(length = 50)
    private String module;

    @Column(name = "entity_id")
    private Long entityId;

    @Column(name = "ip_address", length = 45)
    private String ipAddress;

    @Column(length = 20)
    private String result;

    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "task_id")
    private Task task;

    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
    }
}