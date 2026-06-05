package com.phong.taskmanagement.repository;

import com.phong.taskmanagement.entity.Attachment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AttachmentRepository
        extends JpaRepository<Attachment, Long> {
}