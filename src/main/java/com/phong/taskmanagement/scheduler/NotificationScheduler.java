package com.phong.taskmanagement.scheduler;

import com.phong.taskmanagement.domain.entity.Task;
import com.phong.taskmanagement.domain.repository.TaskRepository;
import com.phong.taskmanagement.service.interfaces.NotificationService;
import com.phong.taskmanagement.service.interfaces.RealTimeUpdateService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class NotificationScheduler {

    private final TaskRepository taskRepository;
    private final NotificationService notificationService;
    private final RealTimeUpdateService realTimeUpdateService;

    /**
     * Run daily at 8:00 AM (server time).
     * Scans for tasks due tomorrow or overdue.
     */
    @Scheduled(cron = "0 0 8 * * *")
    public void scheduleTaskDeadlines() {
        log.info("Running daily task deadline scanner...");
        
        LocalDate today = LocalDate.now();
        LocalDate tomorrow = today.plusDays(1);

        // All tasks not done/cancelled
        List<Task> activeTasks = taskRepository.findAll().stream()
                .filter(t -> t.getAssignee() != null)
                .filter(t -> !"DONE".equals(t.getStatus()) && !"CANCELLED".equals(t.getStatus()))
                .filter(t -> t.getDueDate() != null)
                .toList();

        for (Task task : activeTasks) {
            LocalDate dueDate = task.getDueDate();
            
            if (dueDate.isEqual(tomorrow)) {
                // Due soon (tomorrow)
                notificationService.createNotification(
                        task.getAssignee().getId(),
                        "Task Due Soon",
                        "Your task '" + task.getTitle() + "' is due tomorrow.",
                        "WARNING",
                        task.getId()
                );
            } else if (dueDate.isBefore(today)) {
                // Overdue
                notificationService.createNotification(
                        task.getAssignee().getId(),
                        "Task Overdue",
                        "Your task '" + task.getTitle() + "' is overdue!",
                        "WARNING",
                        task.getId()
                );
            }
        }
        
        log.info("Finished daily task deadline scanner.");
    }
}
