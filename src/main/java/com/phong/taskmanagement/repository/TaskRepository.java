package com.phong.taskmanagement.repository;

import com.phong.taskmanagement.dto.response.TaskPriorityResponse;
import com.phong.taskmanagement.entity.Task;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;

public interface TaskRepository
        extends JpaRepository<Task, Long>, TaskRepositoryCustom {

    long countByStatus(String status);

    long countByDueDateBeforeAndStatusNot(
            LocalDate dueDate,
            String status
    );

    @Query("SELECT new com.phong.taskmanagement.dto.response.TaskPriorityResponse(t.priority, COUNT(t)) " +
            "FROM Task t GROUP BY t.priority")
    List<TaskPriorityResponse> countTasksByPriority();

    Page<Task> findByTitleContainingIgnoreCase(
            String keyword,
            Pageable pageable
    );

    Page<Task> findByStatus(
            String status,
            Pageable pageable
    );

    Page<Task> findByPriority(
            String priority,
            Pageable pageable
    );

    List<Task> findByAssignee_Username(String username);

    Page<Task> findByAssignee_Username(
            String username,
            Pageable pageable
    );

    Page<Task> findByAssignee_UsernameAndStatus(
            String username,
            String status,
            Pageable pageable
    );

    Page<Task> findByAssignee_UsernameAndPriority(
            String username,
            String priority,
            Pageable pageable
    );

    Page<Task> findByAssignee_UsernameAndTitleContainingIgnoreCase(
            String username,
            String keyword,
            Pageable pageable
    );

    List<Task> findByDueDate(LocalDate dueDate);

    List<Task> findByDueDateAndStatusNot(
            LocalDate dueDate,
            String status
    );

    List<Task> findByDueDateBeforeAndStatusNot(
            LocalDate dueDate,
            String status
    );
}