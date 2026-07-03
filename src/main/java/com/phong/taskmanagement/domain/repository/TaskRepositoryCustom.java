package com.phong.taskmanagement.domain.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.phong.taskmanagement.dto.request.TaskSearchRequest;
import com.phong.taskmanagement.domain.entity.Task;

public interface TaskRepositoryCustom {

    Page<Task> searchTasks(TaskSearchRequest request, Pageable pageable);
}
