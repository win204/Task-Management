package com.phong.taskmanagement.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "system_config")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
public class SystemConfig {

    @Id
    @Column(name = "config_key", nullable = false, length = 100)
    private String configKey;

    @Column(name = "config_value", columnDefinition = "NVARCHAR(MAX)")
    private String configValue;

    @Column(name = "description", length = 255)
    private String description;

    @LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @Column(name = "updated_by", length = 50)
    private String updatedBy;
}
