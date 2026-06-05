package com.phong.taskmanagement.service;

import com.phong.taskmanagement.dto.request.CreateTaskRequest;
import com.phong.taskmanagement.entity.Task;
import org.springframework.data.domain.Page;
import java.util.List;

public interface TaskService {

    Task createTask(CreateTaskRequest request);

    List<Task> getAllTasks();

    Task getTaskById(Long id);

    void deleteTask(Long id);

    Task updateTask(Long id, CreateTaskRequest request);   
    
    List<Task> searchTasks(String keyword);

    Page<Task> getTasksWithPaging(int page, int size);
}