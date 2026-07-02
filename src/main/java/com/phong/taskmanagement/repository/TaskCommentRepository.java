package com.phong.taskmanagement.repository;

import com.phong.taskmanagement.entity.TaskComment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskCommentRepository extends JpaRepository<TaskComment, Long> {
    List<TaskComment> findByTaskIdAndParentIsNullOrderByCreatedAtDesc(Long taskId);
    List<TaskComment> findByTaskId(Long taskId);
    
    @org.springframework.transaction.annotation.Transactional
    @org.springframework.data.jpa.repository.Modifying
    @org.springframework.data.jpa.repository.Query("DELETE FROM TaskComment c WHERE c.user = :user")
    void deleteByUser(@org.springframework.data.repository.query.Param("user") com.phong.taskmanagement.entity.User user);
}
