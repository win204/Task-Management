package com.phong.taskmanagement.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.phong.taskmanagement.entity.Attachment;

public interface AttachmentRepository
        extends JpaRepository<Attachment, Long> {

    List<Attachment> findByTaskId(Long taskId);
}
