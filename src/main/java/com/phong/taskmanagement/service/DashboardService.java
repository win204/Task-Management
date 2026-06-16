package com.phong.taskmanagement.service;

import com.phong.taskmanagement.dto.response.DashboardResponse;
import com.phong.taskmanagement.dto.response.TaskPriorityResponse;

import java.util.List;

public interface DashboardService {

    DashboardResponse getSummary();

    List<TaskPriorityResponse> getTaskStatisticsByPriority();
}