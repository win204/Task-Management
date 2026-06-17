package com.phong.taskmanagement.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardResponse {
    private Long totalUsers;
    private Long totalProjects;
    private Long totalTasks;
    private Long completedTasks;
    private Long todoTasks;
    private Long inProgressTasks;
}