package com.phong.taskmanagement.dto.request;

import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TaskSearchRequest {

    private String title;

    private String status;

    private String priority;

    private Long assigneeId;

    private Long projectId;

    private LocalDate dueDate;
}
