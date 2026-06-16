package com.phong.taskmanagement.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.phong.taskmanagement.dto.request.CreateActivityLogRequest;
import com.phong.taskmanagement.dto.response.ActivityLogResponse;
import com.phong.taskmanagement.entity.ActivityLog;
import com.phong.taskmanagement.entity.Task;
import com.phong.taskmanagement.entity.User;
import com.phong.taskmanagement.exception.ResourceNotFoundException;
import com.phong.taskmanagement.repository.ActivityLogRepository;
import com.phong.taskmanagement.repository.TaskRepository;
import com.phong.taskmanagement.repository.UserRepository;
import com.phong.taskmanagement.service.ActivityLogService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ActivityLogServiceImpl
        implements ActivityLogService {

    private final ActivityLogRepository activityLogRepository;
    private final UserRepository userRepository;
    private final TaskRepository taskRepository;

    private ActivityLogResponse mapToResponse(
            ActivityLog log) {

        return ActivityLogResponse.builder()
                .id(log.getId())
                .action(log.getAction())
                .description(log.getDescription())
                .username(
                        log.getUser() != null
                                ? log.getUser().getUsername()
                                : null
                )
                .taskTitle(
                        log.getTask() != null
                                ? log.getTask().getTitle()
                                : null
                )
                .createdAt(log.getCreatedAt())
                .build();
    }

    @Override
    public ActivityLogResponse createLog(
            CreateActivityLogRequest request) {

        User user = userRepository.findById(
                request.getUserId()
        ).orElseThrow(() ->
                new ResourceNotFoundException(
                        "User not found"
                ));

        Task task = taskRepository.findById(
                request.getTaskId()
        ).orElseThrow(() ->
                new ResourceNotFoundException(
                        "Task not found"
                ));

        ActivityLog log = ActivityLog.builder()
                .action(request.getAction())
                .description(request.getDescription())
                .user(user)
                .task(task)
                .build();

        log = activityLogRepository.save(log);

        return mapToResponse(log);
    }

    @Override
    public List<ActivityLogResponse> getAllLogs() {

        return activityLogRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public ActivityLogResponse log(
            Long userId,
            Long taskId,
            String action,
            String description) {

        User user = userRepository.findById(
                userId
        ).orElseThrow(() ->
                new ResourceNotFoundException(
                        "User not found"
                ));

        Task task = taskRepository.findById(
                taskId
        ).orElseThrow(() ->
                new ResourceNotFoundException(
                        "Task not found"
                ));

        ActivityLog log = ActivityLog.builder()
                .action(action)
                .description(description)
                .user(user)
                .task(task)
                .build();

        log = activityLogRepository.save(log);

        return mapToResponse(log);
    }
}