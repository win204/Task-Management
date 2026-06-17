package com.phong.taskmanagement.service.impl;

import com.phong.taskmanagement.dto.response.DashboardResponse;
import com.phong.taskmanagement.dto.response.TaskMonthlyChartResponse;
import com.phong.taskmanagement.dto.response.TaskPriorityChartResponse;
import com.phong.taskmanagement.dto.response.TaskStatusChartResponse;
import com.phong.taskmanagement.repository.ProjectRepository;
import com.phong.taskmanagement.repository.TaskRepository;
import com.phong.taskmanagement.repository.UserRepository;
import com.phong.taskmanagement.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;

    @Override
    @Transactional(readOnly = true)
    public DashboardResponse getDashboardStatistics() {
        return DashboardResponse.builder()
                .totalUsers(userRepository.count())
                .totalProjects(projectRepository.count())
                .totalTasks(taskRepository.count())
                .completedTasks(taskRepository.countByStatus("DONE"))
                .todoTasks(taskRepository.countByStatus("TODO"))
                .inProgressTasks(taskRepository.countByStatus("IN_PROGRESS"))
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<TaskStatusChartResponse> getTaskStatusChart() {
        return taskRepository.countTasksByStatusChart();
    }

    @Override
    @Transactional(readOnly = true)
    public List<TaskPriorityChartResponse> getTaskPriorityChart() {
        return taskRepository.countTasksByPriorityChart();
    }

    @Override
    @Transactional(readOnly = true)
    public List<TaskMonthlyChartResponse> getTasksByMonthChart() {
        List<Object[]> rawCounts = taskRepository.getTaskCountsByStartDate();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM");
        
        Map<String, Long> monthlyAggregations = new LinkedHashMap<>();
        
        for (Object[] row : rawCounts) {
            LocalDate startDate = (LocalDate) row[0];
            Long count = ((Number) row[1]).longValue();
            
            String month = startDate.format(formatter);
            monthlyAggregations.put(month, monthlyAggregations.getOrDefault(month, 0L) + count);
        }
        
        return monthlyAggregations.entrySet().stream()
                .map(entry -> new TaskMonthlyChartResponse(entry.getKey(), entry.getValue()))
                .collect(Collectors.toList());
    }
}