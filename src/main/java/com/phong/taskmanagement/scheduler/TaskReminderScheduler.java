package com.phong.taskmanagement.scheduler;

import java.time.LocalDate;
import java.util.List;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.phong.taskmanagement.domain.entity.Task;
import com.phong.taskmanagement.service.interfaces.EmailService;
import com.phong.taskmanagement.domain.repository.TaskRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class TaskReminderScheduler {

    private final TaskRepository taskRepository;
    private final EmailService emailService;

    @Scheduled(cron = "0 0 8 * * *")
    public void sendTaskReminders() {
        log.info("Executing daily task reminder scheduler...");
        LocalDate tomorrow = LocalDate.now().plusDays(1);
        List<Task> tasks = taskRepository.findByDueDate(tomorrow);

        int count = 0;
        for (Task task : tasks) {
            // Only send reminder if the task is not already done
            if (!"DONE".equalsIgnoreCase(task.getStatus()) && task.getAssignee() != null && task.getAssignee().getEmail() != null) {
                emailService.sendTaskReminderEmail(task);
                count++;
            }
        }
        log.info("Sent {} task reminders for tasks due tomorrow", count);
    }
}
