package com.phong.taskmanagement.dto.request;

import lombok.Data;

@Data
public class CreateActivityLogRequest {

    private String action;

    private String description;

    private Long userId;

    private Long taskId;
}