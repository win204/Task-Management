package com.phong.taskmanagement.presentation.controller;

import com.phong.taskmanagement.application.usecase.TaskService;
import com.phong.taskmanagement.domain.model.Task;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Presentation Layer Controller for Task.
 * Depends ONLY on Application Use Cases.
 */
@RestController("cleanTaskController")
@RequestMapping("/api/v2/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @PostMapping
    public ResponseEntity<Task> createTask(@RequestBody TaskRequest request) {
        return ResponseEntity.ok(taskService.createTask(request.title(), request.description()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Task> getTask(@PathVariable Long id) {
        return ResponseEntity.ok(taskService.getTask(id));
    }

    @GetMapping
    public ResponseEntity<List<Task>> getAllTasks() {
        return ResponseEntity.ok(taskService.getAllTasks());
    }

    public record TaskRequest(String title, String description) {}
}
