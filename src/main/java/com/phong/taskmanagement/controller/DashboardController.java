package com.phong.taskmanagement.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.phong.taskmanagement.dto.response.ApiResponse;
import com.phong.taskmanagement.dto.response.DashboardResponse;
import com.phong.taskmanagement.dto.response.TaskPriorityResponse;
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
@Tag(
        name = "Dashboard API",
        description = "APIs for dashboard"
)
public class DashboardController {

    private final DashboardService dashboardService;

    @Operation(
            summary = "Get dashboard summary",
            description = "Retrieve dashboard summary statistics"
    )
    @GetMapping
    public ApiResponse<DashboardResponse> getDashboard() {

        DashboardResponse response = dashboardService.getSummary();
        return ApiResponse.success(response, "Dashboard retrieved successfully");
    }

    @Operation(
            summary = "Get task statistics by priority",
            description = "Retrieve task counts grouped by priority"
    )
    @GetMapping("/statistics/priority")
    public ApiResponse<List<TaskPriorityResponse>> getTaskStatisticsByPriority() {

        List<TaskPriorityResponse> response =
                dashboardService.getTaskStatisticsByPriority();
        return ApiResponse.success(response,
                "Task statistics by priority retrieved successfully");
    }
}