package com.phong.taskmanagement.domain.model;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

/**
 * Domain Model for Project.
 */
@Getter
@Setter
@Builder
public class Project {
    private Long id;
    private String name;
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;
    private String status;
    private Long managerId;
}
