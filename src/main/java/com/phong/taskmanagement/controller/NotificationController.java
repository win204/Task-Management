package com.phong.taskmanagement.controller;

import com.phong.taskmanagement.dto.response.ApiResponse;
import com.phong.taskmanagement.dto.response.NotificationResponse;
import com.phong.taskmanagement.service.NotificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@Tag(name = "Notification API", description = "APIs for user notifications")
public class NotificationController {

    private final NotificationService notificationService;

    @Operation(summary = "Get notifications by user", description = "Retrieve all notifications for a user (use userId param)")
    @GetMapping
    public ApiResponse<List<NotificationResponse>> getNotifications(@RequestParam Long userId) {
        List<NotificationResponse> list = notificationService.getNotificationsByUser(userId);
        return ApiResponse.success(list, "Notifications retrieved successfully");
    }

    @Operation(summary = "Get unread notifications", description = "Retrieve unread notifications for a user (use userId param)")
    @GetMapping("/unread")
    public ApiResponse<List<NotificationResponse>> getUnread(@RequestParam Long userId) {
        List<NotificationResponse> list = notificationService.getUnreadNotifications(userId);
        return ApiResponse.success(list, "Unread notifications retrieved successfully");
    }

    @Operation(summary = "Mark notification as read", description = "Mark a single notification as read by id")
    @PutMapping("/{id}/read")
    public ApiResponse<Void> markAsRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
        return ApiResponse.success(null, "Notification marked as read");
    }
}
