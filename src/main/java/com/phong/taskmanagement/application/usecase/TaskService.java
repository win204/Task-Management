package com.phong.taskmanagement.application.usecase;

import com.phong.taskmanagement.domain.model.Task;
import com.phong.taskmanagement.domain.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Application Use Case for Task operations.
 * Depends on Domain model and Domain repository interface.
 */
@Service("cleanTaskService")
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;

    public Task createTask(String title, String description) {
        Task task = Task.builder()
                .title(title)
                .description(description)
                .status("TODO")
                .build();
        return taskRepository.save(task);
    }

    public Task getTask(Long id) {
        return taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));
    }

    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }
}
