package com.phong.taskmanagement.service.interfaces;

import com.phong.taskmanagement.domain.entity.Task;

public interface EmailService {

    void sendSimpleEmail(String to, String subject, String text);

    void sendTaskAssignedEmail(Task task);

    void sendTaskReminderEmail(Task task);

    void sendTaskOverdueEmail(String to, String taskTitle);

    void sendTaskCompletedEmail(Task task);

    void sendPasswordResetEmail(String to, String resetToken);
}
