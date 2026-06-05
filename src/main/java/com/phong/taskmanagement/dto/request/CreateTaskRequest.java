package com.phong.taskmanagement.dto.request;

import lombok.Data;

import java.time.LocalDate;

@Data
public class CreateTaskRequest {

    private String title;

    private String description;

    private String priority;

    private String status;

    private LocalDate startDate;

    private LocalDate dueDate;

    private Long projectId;

    private Long assigneeId;
}