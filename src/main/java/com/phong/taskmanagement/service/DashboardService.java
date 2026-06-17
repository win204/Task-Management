package com.phong.taskmanagement.service;

import com.phong.taskmanagement.dto.response.DashboardResponse;
import com.phong.taskmanagement.dto.response.TaskMonthlyChartResponse;
import com.phong.taskmanagement.dto.response.TaskPriorityChartResponse;
import com.phong.taskmanagement.dto.response.TaskStatusChartResponse;

import java.util.List;

public interface DashboardService {
    DashboardResponse getDashboardStatistics();
    List<TaskStatusChartResponse> getTaskStatusChart();
    List<TaskPriorityChartResponse> getTaskPriorityChart();
    List<TaskMonthlyChartResponse> getTasksByMonthChart();
}