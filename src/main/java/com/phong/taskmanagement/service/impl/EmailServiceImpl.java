package com.phong.taskmanagement.service.impl;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.phong.taskmanagement.service.EmailService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;

    @Override
    public void sendTaskAssignedEmail(String to, String taskTitle) {
        sendEmail(
                to,
                "New Task Assigned: " + taskTitle,
                "You have been assigned a new task: " + taskTitle + ".\nPlease log in to the Task Management System for details."
        );
    }

    @Override
    public void sendTaskReminderEmail(String to, String taskTitle) {
        sendEmail(
                to,
                "Task Reminder: " + taskTitle,
                "This is a reminder that the task '" + taskTitle + "' is due tomorrow.\nPlease check and complete it on time."
        );
    }

    @Override
    public void sendTaskOverdueEmail(String to, String taskTitle) {
        sendEmail(
                to,
                "Task Overdue: " + taskTitle,
                "The task '" + taskTitle + "' is now overdue.\nPlease update its status or contact your manager immediately."
        );
    }

    @Override
    public void sendPasswordResetEmail(String to, String resetToken) {
        String resetUrl = "http://localhost:5173/reset-password?token=" + resetToken;
        sendEmail(
                to,
                "Password Reset Request",
                "You have requested to reset your password.\n" +
                "Please click the link below to reset your password:\n\n" +
                resetUrl + "\n\n" +
                "This link will expire in 30 minutes."
        );
    }

    private void sendEmail(String to, String subject, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);
        mailSender.send(message);
    }
}
