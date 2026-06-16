package com.phong.taskmanagement.service;

import java.util.List;

import com.phong.taskmanagement.dto.request.CreateActivityLogRequest;
import com.phong.taskmanagement.dto.response.ActivityLogResponse;

public interface ActivityLogService {

    ActivityLogResponse createLog(
            CreateActivityLogRequest request
    );

    List<ActivityLogResponse> getAllLogs();

    ActivityLogResponse log(
            Long userId,
            Long taskId,
            String action,
            String description
    );
}