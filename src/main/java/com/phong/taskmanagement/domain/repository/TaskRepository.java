package com.phong.taskmanagement.domain.repository;

import com.phong.taskmanagement.domain.model.Task;

import java.util.List;
import java.util.Optional;

/**
 * Domain Repository Interface for Task.
 * No Spring Data JPA dependencies here.
 */
public interface TaskRepository {
    Task save(Task task);
    Optional<Task> findById(Long id);
    List<Task> findAll();
    void deleteById(Long id);
}
