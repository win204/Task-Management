package com.phong.taskmanagement.dto.response;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TaskResponse {

    private Long id;

    private String title;

    private String description;

    private String priority;

    private String status;

    private LocalDate startDate;

    private LocalDate dueDate;

    private String projectName;

    private String assigneeName;
}