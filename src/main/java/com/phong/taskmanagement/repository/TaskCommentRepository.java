package com.phong.taskmanagement.repository;

import com.phong.taskmanagement.entity.TaskComment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskCommentRepository extends JpaRepository<TaskComment, Long> {
    List<TaskComment> findByTaskIdAndParentIsNullOrderByCreatedAtDesc(Long taskId);
    List<TaskComment> findByTaskId(Long taskId);
}
