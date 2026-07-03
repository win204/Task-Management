package com.phong.taskmanagement.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;

import com.phong.taskmanagement.dto.request.CreateActivityLogRequest;
import com.phong.taskmanagement.dto.response.ActivityLogResponse;
import com.phong.taskmanagement.common.response.ApiResponse;
import com.phong.taskmanagement.service.interfaces.ActivityLogService;

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

    @Operation(summary = "Search activity logs with pagination and filters")
    @GetMapping("/search")
    public ApiResponse<Page<ActivityLogResponse>> searchLogs(
            @RequestParam(required = false) String username,
            @RequestParam(required = false) String module,
            @RequestParam(required = false) String action,
            @RequestParam(required = false) String result,
            @RequestParam(required = false) String ipAddress,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @PageableDefault(sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        
        Page<ActivityLogResponse> response = activityLogService.searchLogs(
                username, module, action, result, ipAddress, startDate, endDate, pageable);
        return ApiResponse.success(response, "Activity logs retrieved successfully");
    }
}
