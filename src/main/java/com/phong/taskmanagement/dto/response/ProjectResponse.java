package com.phong.taskmanagement.dto.response;

import org.springframework.hateoas.RepresentationModel;
import java.time.LocalDate;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProjectResponse extends RepresentationModel<ProjectResponse> {

    private Long id;

    private String projectCode;

    private String projectName;

    private String description;

    private LocalDate startDate;

    private LocalDate endDate;

    private String status;
}