package com.phong.taskmanagement.domain.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.phong.taskmanagement.domain.entity.Attachment;

public interface AttachmentRepository
        extends JpaRepository<Attachment, Long> {

    List<Attachment> findByTaskId(Long taskId);
}
