package com.phong.taskmanagement.repository;

import com.phong.taskmanagement.entity.ActivityLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ActivityLogRepository
        extends JpaRepository<ActivityLog, Long> {
}