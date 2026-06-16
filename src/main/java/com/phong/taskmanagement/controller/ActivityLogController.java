package com.phong.taskmanagement.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.phong.taskmanagement.dto.request.CreateActivityLogRequest;
import com.phong.taskmanagement.dto.response.ActivityLogResponse;
import com.phong.taskmanagement.dto.response.ApiResponse;
import com.phong.taskmanagement.service.ActivityLogService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/activity-logs")
@RequiredArgsConstructor
@Tag(
        name = "Activity Log API",
        description = "APIs for managing activity logs"
)
public class ActivityLogController {

    private final ActivityLogService activityLogService;

    @Operation(
            summary = "Create activity log",
            description = "Create a new activity log"
    )
    @PostMapping
    public ApiResponse<ActivityLogResponse> createLog(
            @RequestBody
            CreateActivityLogRequest request) {

        ActivityLogResponse response = activityLogService.createLog(
                request
        );
        return ApiResponse.success(response, "Activity log created successfully");
    }

    @Operation(
            summary = "Get all activity logs",
            description = "Retrieve all activity logs"
    )
    @GetMapping
    public ApiResponse<List<ActivityLogResponse>> getAllLogs() {

        List<ActivityLogResponse> response = activityLogService.getAllLogs();
        return ApiResponse.success(response, "Activity logs retrieved successfully");
    }
}