package com.phong.taskmanagement.scheduler;

import java.time.LocalDate;
import java.util.List;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.phong.taskmanagement.entity.Task;
import com.phong.taskmanagement.service.EmailService;
import com.phong.taskmanagement.repository.TaskRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class TaskScheduler {

    private final TaskRepository taskRepository;
    private final EmailService emailService;

    @Scheduled(cron = "0 0 8 * * *")
    public void sendTaskReminders() {
        LocalDate tomorrow = LocalDate.now().plusDays(1);
        List<Task> tasks = taskRepository.findByDueDate(tomorrow);

        for (Task task : tasks) {
            if (task.getAssignee() == null || task.getAssignee().getEmail() == null) {
                continue;
            }
            emailService.sendTaskReminderEmail(
                    task.getAssignee().getEmail(),
                    task.getTitle()
            );
        }
    }

    @Scheduled(cron = "0 0 9 * * *")
    public void sendOverdueTaskAlerts() {
        LocalDate today = LocalDate.now();
        List<Task> tasks = taskRepository.findByDueDateBeforeAndStatusNot(
                today,
                "DONE"
        );

        for (Task task : tasks) {
            if (task.getAssignee() == null || task.getAssignee().getEmail() == null) {
                continue;
            }
            emailService.sendTaskOverdueEmail(
                    task.getAssignee().getEmail(),
                    task.getTitle()
            );
        }
    }
}
