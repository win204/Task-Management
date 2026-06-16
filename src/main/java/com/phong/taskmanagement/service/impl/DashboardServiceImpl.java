package com.phong.taskmanagement.service.impl;

import com.phong.taskmanagement.dto.response.DashboardResponse;
import com.phong.taskmanagement.dto.response.TaskPriorityResponse;
import com.phong.taskmanagement.repository.ProjectRepository;
import com.phong.taskmanagement.repository.TaskRepository;
import com.phong.taskmanagement.repository.UserRepository;
import com.phong.taskmanagement.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl
        implements DashboardService {

    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;

    @Override
    public DashboardResponse getSummary() {
        long totalTasks = taskRepository.count();
        long completedTasks = taskRepository.countByStatus("DONE");
        long inProgressTasks = taskRepository.countByStatus("IN_PROGRESS");
        long todoTasks = taskRepository.countByStatus("TODO");
        long overdueTasks = taskRepository.countByDueDateBeforeAndStatusNot(
                LocalDate.now(), "DONE");

        double completionRate = totalTasks == 0
                ? 0.0
                : (double) completedTasks / totalTasks * 100.0;

        return DashboardResponse.builder()
                .totalUsers(userRepository.count())
                .totalProjects(projectRepository.count())
                .totalTasks(totalTasks)
                .completedTasks(completedTasks)
                .inProgressTasks(inProgressTasks)
                .todoTasks(todoTasks)
                .overdueTasks(overdueTasks)
                .completionRate(Math.round(completionRate * 100.0) / 100.0)
                .build();
    }

    @Override
    public List<TaskPriorityResponse> getTaskStatisticsByPriority() {
        return taskRepository.countTasksByPriority();
    }
}