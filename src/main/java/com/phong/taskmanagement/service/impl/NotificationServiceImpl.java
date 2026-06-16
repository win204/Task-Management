package com.phong.taskmanagement.service.impl;

import com.phong.taskmanagement.dto.response.NotificationResponse;
import com.phong.taskmanagement.entity.Notification;
import com.phong.taskmanagement.entity.User;
import com.phong.taskmanagement.exception.ResourceNotFoundException;
import com.phong.taskmanagement.repository.NotificationRepository;
import com.phong.taskmanagement.repository.UserRepository;
import com.phong.taskmanagement.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public void createNotification(Long userId, String title, String message, String type) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Notification n = Notification.builder()
                .user(user)
                .title(title)
                .message(message)
                .type(type)
                .isRead(false)
                .build();

        notificationRepository.save(n);
    }

    @Override
    public List<NotificationResponse> getNotificationsByUser(Long userId) {
        List<Notification> list = notificationRepository.findByUserId(userId);
        return list.stream().map(this::map).collect(Collectors.toList());
    }

    @Override
    public List<NotificationResponse> getUnreadNotifications(Long userId) {
        List<Notification> list = notificationRepository.findByUserIdAndIsReadFalse(userId);
        return list.stream().map(this::map).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void markAsRead(Long id) {
        Notification n = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));
        n.setIsRead(true);
        notificationRepository.save(n);
    }

    private NotificationResponse map(Notification n) {
        return NotificationResponse.builder()
                .id(n.getId())
                .title(n.getTitle())
                .message(n.getMessage())
                .type(n.getType())
                .isRead(n.getIsRead())
                .createdAt(n.getCreatedAt())
                .build();
    }
}
