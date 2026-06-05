package com.phong.taskmanagement.dto.request;

import lombok.Data;

import java.time.LocalDate;

@Data
public class CreateProjectRequest {

    private String projectCode;

    private String projectName;

    private String description;

    private LocalDate startDate;

    private LocalDate endDate;

    private String status;
}