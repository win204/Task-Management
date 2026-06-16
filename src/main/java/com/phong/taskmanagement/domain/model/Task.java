package com.phong.taskmanagement.domain.model;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

/**
 * Domain Model for Task.
 * Notice there are no JPA annotations (@Entity, @Table, etc.) here.
 * This class represents pure business logic.
 */
@Getter
@Setter
@Builder
public class Task {
    private Long id;
    private String title;
    private String description;
    private String status;
    private LocalDate dueDate;
    private Long assigneeId;
    private Long projectId;

    public boolean isOverdue() {
        return dueDate != null && dueDate.isBefore(LocalDate.now()) && !"DONE".equalsIgnoreCase(status);
    }
}
