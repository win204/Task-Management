package com.phong.taskmanagement.repository;

import com.phong.taskmanagement.entity.ActivityLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

public interface ActivityLogRepository
        extends JpaRepository<ActivityLog, Long> {

    boolean existsByTaskId(Long taskId);

    @Modifying
    @Query("DELETE FROM ActivityLog a WHERE a.task.id = :taskId")
    void deleteByTaskId(Long taskId);

    @Modifying
    @Query("DELETE FROM ActivityLog a WHERE a.task.project.id = :projectId")
    void deleteByTaskProjectId(Long projectId);

    @Modifying
    @Query("UPDATE ActivityLog a SET a.user = null WHERE a.user.id = :userId")
    void updateUserToNull(Long userId);
}