package com.phong.taskmanagement.service.interfaces;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RealTimeUpdateService {

    private final SimpMessagingTemplate messagingTemplate;

    public void broadcastProjectUpdate(Object payload) {
        messagingTemplate.convertAndSend("/topic/projects", payload);
    }

    public void broadcastTaskUpdate(Object payload) {
        messagingTemplate.convertAndSend("/topic/tasks", payload);
    }

    public void broadcastDashboardUpdate(Object payload) {
        messagingTemplate.convertAndSend("/topic/dashboard", payload);
    }

    public void broadcastUserUpdate(Object payload) {
        messagingTemplate.convertAndSend("/topic/users", payload);
    }

    public void sendNotificationToUser(String username, Object payload) {
        messagingTemplate.convertAndSendToUser(username, "/queue/notifications", payload);
    }

    public void sendProfileUpdateToUser(String username, Object payload) {
        messagingTemplate.convertAndSendToUser(username, "/queue/profile", payload);
    }
}
