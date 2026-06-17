package com.phong.taskmanagement.controller;

import com.phong.taskmanagement.dto.response.ApiResponse;
import com.phong.taskmanagement.dto.response.DashboardResponse;
import com.phong.taskmanagement.dto.response.TaskMonthlyChartResponse;
import com.phong.taskmanagement.dto.response.TaskPriorityChartResponse;
import com.phong.taskmanagement.dto.response.TaskStatusChartResponse;
import com.phong.taskmanagement.service.DashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@Tag(name = "Dashboard API", description = "APIs for dashboard statistics")
public class DashboardController {

    private final DashboardService dashboardService;

    @Operation(summary = "Get dashboard statistics")
    @GetMapping
    public ApiResponse<DashboardResponse> getDashboardStatistics() {
        return ApiResponse.success(
                dashboardService.getDashboardStatistics(),
                "Dashboard statistics retrieved successfully"
        );
    }

    @Operation(summary = "Get task status chart data")
    @GetMapping("/task-status")
    public ApiResponse<List<TaskStatusChartResponse>> getTaskStatusChart() {
        return ApiResponse.success(
                dashboardService.getTaskStatusChart(),
                "Task status chart retrieved successfully"
        );
    }

    @Operation(summary = "Get task priority chart data")
    @GetMapping("/task-priority")
    public ApiResponse<List<TaskPriorityChartResponse>> getTaskPriorityChart() {
        return ApiResponse.success(
                dashboardService.getTaskPriorityChart(),
                "Task priority chart retrieved successfully"
        );
    }

    @Operation(summary = "Get tasks created by month chart data")
    @GetMapping("/tasks-by-month")
    public ApiResponse<List<TaskMonthlyChartResponse>> getTasksByMonthChart() {
        return ApiResponse.success(
                dashboardService.getTasksByMonthChart(),
                "Tasks by month chart retrieved successfully"
        );
    }
}