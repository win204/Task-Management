package com.phong.taskmanagement.service.impl;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

import com.querydsl.core.BooleanBuilder;
import com.phong.taskmanagement.entity.QActivityLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import jakarta.servlet.http.HttpServletRequest;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ActivityLogServiceImpl
        implements ActivityLogService {

    private final ActivityLogRepository activityLogRepository;
    private final UserRepository userRepository;
    private final TaskRepository taskRepository;

    private String getClientIp() {
        ServletRequestAttributes attribs = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (attribs != null) {
            HttpServletRequest request = attribs.getRequest();
            String ip = request.getHeader("X-Forwarded-For");
            if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
                ip = request.getRemoteAddr();
            }
            if (ip != null && ip.contains(",")) {
                ip = ip.split(",")[0].trim();
            }
            return ip;
        }
        return "SYSTEM";
    }

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
                .module(log.getModule())
                .entityId(log.getEntityId())
                .ipAddress(log.getIpAddress())
                .result(log.getResult())
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
                .ipAddress(getClientIp())
                .result("SUCCESS")
                .module("TASK")
                .entityId(task.getId())
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
    public Page<ActivityLogResponse> searchLogs(
            String username,
            String module,
            String action,
            String result,
            String ipAddress,
            String startDate,
            String endDate,
            Pageable pageable) {

        QActivityLog qLog = QActivityLog.activityLog;
        BooleanBuilder builder = new BooleanBuilder();

        if (username != null && !username.trim().isEmpty()) {
            if (username.equalsIgnoreCase("system")) {
                builder.and(qLog.user().isNull());
            } else {
                builder.and(qLog.user().username.containsIgnoreCase(username));
            }
        }
        if (module != null && !module.trim().isEmpty()) {
            builder.and(qLog.module.eq(module));
        }
        if (action != null && !action.trim().isEmpty()) {
            builder.and(qLog.action.containsIgnoreCase(action));
        }
        if (result != null && !result.trim().isEmpty()) {
            builder.and(qLog.result.eq(result));
        }
        if (ipAddress != null && !ipAddress.trim().isEmpty()) {
            builder.and(qLog.ipAddress.containsIgnoreCase(ipAddress));
        }
        if (startDate != null && !startDate.trim().isEmpty()) {
            LocalDateTime start;
            try {
                start = java.time.OffsetDateTime.parse(startDate).withOffsetSameInstant(java.time.ZoneOffset.UTC).toLocalDateTime();
            } catch (Exception e) {
                start = LocalDateTime.parse(startDate, DateTimeFormatter.ISO_DATE_TIME);
            }
            builder.and(qLog.createdAt.goe(start));
        }
        if (endDate != null && !endDate.trim().isEmpty()) {
            LocalDateTime end;
            try {
                end = java.time.OffsetDateTime.parse(endDate).withOffsetSameInstant(java.time.ZoneOffset.UTC).toLocalDateTime();
            } catch (Exception e) {
                end = LocalDateTime.parse(endDate, DateTimeFormatter.ISO_DATE_TIME);
            }
            builder.and(qLog.createdAt.loe(end));
        }

        Page<ActivityLog> page = activityLogRepository.findAll(builder, pageable);
        return page.map(this::mapToResponse);
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
                .module("TASK")
                .entityId(task.getId())
                .ipAddress(getClientIp())
                .result("SUCCESS")
                .build();

        log = activityLogRepository.save(log);

        return mapToResponse(log);
    }
    @Override
    public ActivityLogResponse log(
            Long userId,
            Long entityId,
            String module,
            String action,
            String description) {

        User user = null;
        if (userId != null) {
            user = userRepository.findById(userId).orElse(null);
        }

        ActivityLog log = ActivityLog.builder()
                .action(action)
                .description(description)
                .user(user)
                .module(module)
                .entityId(entityId)
                .ipAddress(getClientIp())
                .result("SUCCESS")
                .build();

        log = activityLogRepository.save(log);

        return mapToResponse(log);
    }
}