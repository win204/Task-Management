package com.phong.taskmanagement.service.impl;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import com.phong.taskmanagement.entity.Task;
import com.phong.taskmanagement.service.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;

    @Async
    @Override
    public void sendSimpleEmail(String to, String subject, String text) {
        sendEmail(to, subject, text);
    }

    @Async
    @Override
    public void sendTaskAssignedEmail(Task task) {
        if (task.getAssignee() == null || task.getAssignee().getEmail() == null) return;
        
        String subject = "New Task Assigned: " + task.getTitle();
        String text = String.format(
                "You have been assigned a new task.\n\n" +
                "Task Title: %s\n" +
                "Description: %s\n" +
                "Priority: %s\n" +
                "Status: %s\n" +
                "Project Name: %s\n" +
                "Due Date: %s\n" +
                "Assigned User: %s\n\n" +
                "Please log in to the Task Management System for details.",
                task.getTitle(),
                task.getDescription() != null ? task.getDescription() : "N/A",
                task.getPriority(),
                task.getStatus(),
                task.getProject() != null ? task.getProject().getProjectName() : "N/A",
                task.getDueDate() != null ? task.getDueDate().toString() : "N/A",
                task.getAssignee().getFullName()
        );
        sendEmail(task.getAssignee().getEmail(), subject, text);
    }

    @Async
    @Override
    public void sendTaskReminderEmail(Task task) {
        if (task.getAssignee() == null || task.getAssignee().getEmail() == null) return;
        
        String subject = "Task Due Tomorrow: " + task.getTitle();
        String text = String.format(
                "This is a reminder that the following task is due tomorrow.\n\n" +
                "Task Title: %s\n" +
                "Due Date: %s\n" +
                "Priority: %s\n" +
                "Project Name: %s\n\n" +
                "Please check and complete it on time.",
                task.getTitle(),
                task.getDueDate() != null ? task.getDueDate().toString() : "N/A",
                task.getPriority(),
                task.getProject() != null ? task.getProject().getProjectName() : "N/A"
        );
        sendEmail(task.getAssignee().getEmail(), subject, text);
    }

    @Async
    @Override
    public void sendTaskCompletedEmail(Task task) {
        if (task.getAssignee() == null || task.getAssignee().getEmail() == null) return;
        
        String subject = "Task Completed: " + task.getTitle();
        String text = String.format(
                "The following task has been marked as completed.\n\n" +
                "Task Title: %s\n" +
                "Project Name: %s\n" +
                "Completed By: %s\n",
                task.getTitle(),
                task.getProject() != null ? task.getProject().getProjectName() : "N/A",
                task.getAssignee().getFullName()
        );
        sendEmail(task.getAssignee().getEmail(), subject, text);
    }

    @Async
    @Override
    public void sendTaskOverdueEmail(String to, String taskTitle) {
        sendEmail(
                to,
                "Task Overdue: " + taskTitle,
                "The task '" + taskTitle + "' is now overdue.\nPlease update its status or contact your manager immediately."
        );
    }

    @Async
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
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(text, false);
            mailSender.send(message);
            log.info("Email sent successfully to {}", to);
        } catch (MessagingException | MailException e) {
            log.error("Failed to send email to {}: {}", to, e.getMessage());
            // Intentionally swallow exception to prevent transaction rollback
        }
    }
}
