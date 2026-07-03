package com.phong.taskmanagement.service.interfaces;

import com.phong.taskmanagement.dto.response.NotificationResponse;

import java.util.List;

public interface NotificationService {

    void createNotification(Long userId, String title, String message, String type);
    void createNotification(Long userId, String title, String message, String type, Long relatedEntityId);

    List<NotificationResponse> getNotificationsByUser(Long userId);

    List<NotificationResponse> getUnreadNotifications(Long userId);

    void markAsRead(Long id);
}
