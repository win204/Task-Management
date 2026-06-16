package com.phong.taskmanagement.service;

import java.util.List;

import org.springframework.data.domain.Page;

import com.phong.taskmanagement.dto.request.CreateTaskRequest;
import com.phong.taskmanagement.dto.request.TaskSearchRequest;
import com.phong.taskmanagement.dto.response.TaskResponse;

public interface TaskService {

    TaskResponse createTask(CreateTaskRequest request);

    List<TaskResponse> getAllTasks();

    TaskResponse getTaskById(Long id);

    void deleteTask(Long id);

    TaskResponse updateTask(
            Long id,
            CreateTaskRequest request
    );

    Page<TaskResponse> searchTasks(
            String keyword,
            int page,
            int size
    );

    Page<TaskResponse> searchTasks(
            TaskSearchRequest request,
            int page,
            int size
    );

    Page<TaskResponse> getTasksByStatus(
            String status,
            int page,
            int size
    );

    Page<TaskResponse> getTasksByPriority(
            String priority,
            int page,
            int size
    );

    Page<TaskResponse> getTasksWithPaging(
            int page,
            int size
    );
}