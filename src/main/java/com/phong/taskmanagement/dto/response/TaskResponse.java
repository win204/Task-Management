package com.phong.taskmanagement.dto.response;

import lombok.*;
import org.springframework.hateoas.RepresentationModel;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TaskResponse extends RepresentationModel<TaskResponse> {

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