package com.phong.taskmanagement.service;

public interface EmailService {

    void sendTaskAssignedEmail(String to, String taskTitle);

    void sendTaskReminderEmail(String to, String taskTitle);

    void sendTaskOverdueEmail(String to, String taskTitle);

    void sendPasswordResetEmail(String to, String resetToken);
}
