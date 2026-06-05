package com.phong.taskmanagement.repository;

import com.phong.taskmanagement.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {

    long countByStatus(String status);

    List<Task> findByTitleContainingIgnoreCase(String keyword);
}