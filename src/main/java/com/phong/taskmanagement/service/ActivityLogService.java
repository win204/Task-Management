package com.phong.taskmanagement.service;

import com.phong.taskmanagement.dto.request.CreateActivityLogRequest;
import com.phong.taskmanagement.entity.ActivityLog;

import java.util.List;

public interface ActivityLogService {

    ActivityLog createLog(CreateActivityLogRequest request);

    List<ActivityLog> getAllLogs();
}