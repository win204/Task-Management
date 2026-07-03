package com.phong.taskmanagement.service.interfaces;

import java.util.List;

import com.phong.taskmanagement.dto.request.CreateActivityLogRequest;
import com.phong.taskmanagement.dto.response.ActivityLogResponse;

public interface ActivityLogService {

    ActivityLogResponse createLog(
            CreateActivityLogRequest request
    );

    List<ActivityLogResponse> getAllLogs();

    org.springframework.data.domain.Page<ActivityLogResponse> searchLogs(
            String username,
            String module,
            String action,
            String result,
            String ipAddress,
            String startDate,
            String endDate,
            org.springframework.data.domain.Pageable pageable
    );

    ActivityLogResponse log(
            Long userId,
            Long entityId,
            String module,
            String action,
            String description
    );

    // Keep backwards compatible version for existing code
    ActivityLogResponse log(
            Long userId,
            Long taskId,
            String action,
            String description
    );
}
