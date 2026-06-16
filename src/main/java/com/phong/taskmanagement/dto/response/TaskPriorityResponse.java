package com.phong.taskmanagement.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TaskPriorityResponse {

    private String priority;

    private Long count;
}
