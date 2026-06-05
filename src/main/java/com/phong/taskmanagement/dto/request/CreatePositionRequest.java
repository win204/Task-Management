package com.phong.taskmanagement.dto.request;

import lombok.Data;

@Data
public class CreatePositionRequest {

    private String name;

    private String description;
}