package com.phong.taskmanagement.dto.response;

import java.time.LocalDateTime;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ActivityLogResponse {

    private Long id;

    private String action;

    private String description;

    private String username;

    private String taskTitle;

    private LocalDateTime createdAt;
}