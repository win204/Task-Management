package com.phong.taskmanagement.service;

import com.phong.taskmanagement.dto.response.NotificationResponse;

import java.util.List;

public interface NotificationService {

    void createNotification(Long userId, String title, String message, String type);

    List<NotificationResponse> getNotificationsByUser(Long userId);

    List<NotificationResponse> getUnreadNotifications(Long userId);

    void markAsRead(Long id);
}
